from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver


# --- Modelo para el Perfil de Usuario ---
# Este modelo extiende el modelo de usuario por defecto de Django para añadir campos adicionales.
class Profile(models.Model):
    # Define las opciones disponibles para el campo 'role'.
    ROLE_CHOICES = [
        ('admin', 'Administrador'),
        ('agent', 'Corredor Inmobiliario'),
        ('buyer', 'Comprador'),
    ]
    # Crea una relación uno a uno con el modelo User. Si un usuario se borra, su perfil también.
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    # Campo para la foto de perfil. Las imágenes se subirán a 'media/avatars/'.
    # 'default' especifica una imagen por defecto si el usuario no sube ninguna.
    avatar = models.ImageField(
        upload_to='avatars/', null=True, blank=True, default='avatars/default.png')
    # Campo para almacenar el rol del usuario, con opciones predefinidas y un valor por defecto.
    role = models.CharField(
        max_length=10, choices=ROLE_CHOICES, default='buyer')

    # Define cómo se mostrará un objeto Profile en el panel de administración.
    def __str__(self):
        return self.user.username


# --- Señal (Signal) para la Creación Automática de Perfiles ---
# Esta función se ejecuta automáticamente cada vez que se guarda un objeto User.
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    # 'created' es un booleano que es True solo si el objeto User se acaba de crear.
    if created:
        # Si el usuario es nuevo, se crea un objeto Profile asociado a él.
        Profile.objects.create(user=instance)
