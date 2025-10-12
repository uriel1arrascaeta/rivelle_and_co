from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import Profile

# Define un 'inline' para el modelo Profile.
# Esto permite ver y editar el perfil directamente desde la página de edición del usuario.


class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False  # No queremos borrar el perfil sin borrar el usuario.
    verbose_name_plural = 'Perfil'
    fk_name = 'user'

# Define una nueva clase de administración para el modelo User.


class CustomUserAdmin(BaseUserAdmin):
    inlines = (ProfileInline,)
    list_display = ('username', 'email', 'first_name',
                    'last_name', 'is_staff', 'get_role')
    list_select_related = ('profile',)

    @admin.display(ordering='profile__role', description='Rol')
    def get_role(self, instance):
        try:
            # Intenta obtener el rol desde el perfil del usuario.
            return instance.profile.get_role_display()
        except Profile.DoesNotExist:
            # Si el usuario no tiene perfil, muestra un texto por defecto.
            return 'Sin perfil'


# Primero, quitamos el registro por defecto del modelo User.
admin.site.unregister(User)
# Luego, registramos el modelo User con nuestra configuración personalizada.
admin.site.register(User, CustomUserAdmin)
