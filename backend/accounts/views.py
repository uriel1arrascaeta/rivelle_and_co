from rest_framework import viewsets, mixins, status, generics
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth.models import User
from rest_framework.authtoken.views import ObtainAuthToken
from .serializers import UserSerializer, ProfileSerializer
from .models import Profile
from rest_framework.authtoken.models import Token


# --- Vista para el Registro de Usuarios ---
# Usa 'CreateModelMixin' para proporcionar la funcionalidad de creación (POST).
class UserRegistrationViewSet(mixins.CreateModelMixin,
                              viewsets.GenericViewSet):
    """
    Punto de API que permite a los usuarios registrarse.
    Al registrarse, devuelve los datos del usuario y un token de autenticación.
    """
    # No queremos que esta vista liste usuarios, por lo que el queryset está vacío.
    queryset = User.objects.none()  # No queremos listar usuarios
    serializer_class = UserSerializer
    # Permite que cualquier usuario (incluso anónimo) acceda a esta vista para registrarse.
    permission_classes = [AllowAny]  # Cualquiera puede registrarse

    # Sobrescribimos el método 'create' para personalizar la respuesta.
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        # Crea un token de autenticación para el nuevo usuario.
        token, created = Token.objects.get_or_create(user=user)
        headers = self.get_success_headers(serializer.data)

        # Devuelve el token y algunos datos básicos del usuario.
        return Response(
            {'token': token.key, 'user_id': user.pk, 'email': user.email},
            status=status.HTTP_201_CREATED,
            headers=headers
        )


# --- Vista Personalizada para el Inicio de Sesión ---
# Hereda de la vista de DRF para obtener tokens, pero la personalizamos.
class CustomAuthToken(ObtainAuthToken):
    """
    Vista de login personalizada que devuelve el token y los datos del usuario.
    """

    # Sobrescribimos el método 'post' para cambiar la respuesta.
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        # Además del token, devolvemos el ID, nombre y rol del usuario.
        # Esto es útil para que el frontend sepa cómo comportarse.
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'first_name': user.first_name,
            'role': user.profile.role
        })


# --- Vista para Ver y Actualizar el Perfil ---
# Hereda de una clase que maneja GET (ver) y PUT/PATCH (actualizar).
class ProfileView(generics.RetrieveUpdateAPIView):
    """
    Vista para ver y editar el perfil del usuario autenticado.
    """
    serializer_class = ProfileSerializer
    # Solo usuarios autenticados pueden ver o editar su perfil.
    permission_classes = [IsAuthenticated]
    # Permite que la vista acepte datos de formulario con archivos (para el avatar).
    parser_classes = [MultiPartParser, FormParser]

    # Sobrescribimos este método para que siempre devuelva el perfil del usuario que hace la petición.
    def get_object(self):
        # Obtiene el perfil, y si no existe, lo crea.
        profile, created = Profile.objects.get_or_create(
            user=self.request.user)
        return profile


# --- Vistas para la Administración de Corredores ---

class PendingAgentsListView(generics.ListAPIView):
    """
    Vista para que el admin vea los corredores pendientes de aprobación.
    """
    # Usamos el ProfileSerializer para obtener los datos del perfil y del usuario.
    serializer_class = ProfileSerializer
    # Solo los administradores pueden acceder.
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        # Filtramos los perfiles de usuarios que son corredores y están inactivos.
        return Profile.objects.filter(user__is_active=False, role='agent')


class AgentApprovalView(generics.UpdateAPIView):
    """
    Vista para que el admin apruebe o rechace a un corredor.
    """
    queryset = User.objects.filter(profile__role='agent')
    permission_classes = [IsAdminUser]

    def patch(self, request, *args, **kwargs):
        user = self.get_object()
        action = request.data.get("action")

        if action == "approve":
            user.is_active = True
            user.save()
            return Response({'status': 'Corredor aprobado'}, status=status.HTTP_200_OK)
        elif action == "reject":
            # Opcional: podrías marcarlo como rechazado en lugar de borrarlo.
            user.delete()
            return Response({'status': 'Corredor rechazado y eliminado'}, status=status.HTTP_204_NO_CONTENT)

        return Response({'error': 'Acción no válida'}, status=status.HTTP_400_BAD_REQUEST)


class AllUsersListView(generics.ListAPIView):
    """
    Vista para que el admin vea una lista de todos los usuarios.
    """
    serializer_class = ProfileSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        # Devuelve todos los perfiles, ordenados por fecha de registro del usuario.
        return Profile.objects.all().order_by('-user__date_joined')
