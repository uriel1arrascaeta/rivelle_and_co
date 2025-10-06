from rest_framework import viewsets, mixins, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from .serializers import UserSerializer
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
