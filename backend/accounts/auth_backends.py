from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
from django.db.models import Q

UserModel = get_user_model()


class EmailOrUsernameBackend(ModelBackend):
    """
    Backend de autenticación personalizado que permite a los usuarios
    iniciar sesión con su email o su nombre de usuario.
    """

    def authenticate(self, request, username=None, password=None, **kwargs):
        try:
            # Intenta encontrar un usuario que coincida con el email o el username (case-insensitive).
            user = UserModel.objects.get(
                Q(username__iexact=username) | Q(email__iexact=username))
        except UserModel.DoesNotExist:
            return None  # No se encontró ningún usuario

        # Si se encontró un usuario, comprueba la contraseña.
        if user.check_password(password) and self.user_can_authenticate(user):
            return user
        return None
