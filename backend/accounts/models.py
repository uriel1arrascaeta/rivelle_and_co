from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver


class Profile(models.Model):
    ROLE_CHOICES = [
        ('admin', 'Administrador'),
        ('agent', 'Corredor Inmobiliario'),
        ('buyer', 'Comprador'),
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    avatar = models.ImageField(
        upload_to='avatars/', null=True, blank=True, default='avatars/default.png')
    role = models.CharField(
        max_length=10, choices=ROLE_CHOICES, default='buyer')

    def __str__(self):
        return self.user.username

# Signal para crear un perfil automáticamente cuando se crea un usuario


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
