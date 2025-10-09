from rest_framework import viewsets, mixins, status, generics
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth.models import User
from rest_framework.authtoken.views import ObtainAuthToken
from .serializers import UserSerializer, ProfileSerializer
from .models import Profile
from rest_framework.authtoken.models import Token


class UserRegistrationViewSet(mixins.CreateModelMixin,
                              viewsets.GenericViewSet):
    """
    Punto de API que permite a los usuarios registrarse.
    Al registrarse, devuelve los datos del usuario y un token de autenticación.
    """
    queryset = User.objects.none()  # No queremos listar usuarios
    serializer_class = UserSerializer
    permission_classes = [AllowAny]  # Cualquiera puede registrarse

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, created = Token.objects.get_or_create(user=user)
        headers = self.get_success_headers(serializer.data)

        return Response(
            {'token': token.key, 'user_id': user.pk, 'email': user.email},
            status=status.HTTP_201_CREATED,
            headers=headers
        )


class CustomAuthToken(ObtainAuthToken):
    """
    Vista de login personalizada que devuelve el token y los datos del usuario.
    """

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'first_name': user.first_name,
            'role': user.profile.role
        })


class ProfileView(generics.RetrieveUpdateAPIView):
    """
    Vista para ver y editar el perfil del usuario autenticado.
    """
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_object(self):
        # Obtiene el perfil, y si no existe, lo crea.
        profile, created = Profile.objects.get_or_create(
            user=self.request.user)
        return profile
