
from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify


# --- Modelo para las Publicaciones (Posts) ---
# Este es el modelo principal que representa una publicación en el blog.
class Post(models.Model):
    # El título de la publicación.
    title = models.CharField(max_length=200)
    # El 'slug' es una versión del título amigable para las URLs (ej: /blog/mi-primer-post).
    # Es único para que no haya dos posts con la misma URL.
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    # Relaciona el post con un usuario (el autor). Si el usuario se borra, sus posts también.
    author = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='blog_posts')
    # El contenido principal del post.
    content = models.TextField()
    # Campo para la imagen principal del post. Se guarda en la carpeta 'media/posts_images/'.
    image = models.ImageField(upload_to='posts_images/', blank=True, null=True)
    # Un campo que relaciona el post con múltiples usuarios (los que le dieron "Me Gusta").
    # 'related_name' nos permite acceder a los posts que le gustaron a un usuario con `user.liked_posts`.
    likes = models.ManyToManyField(
        User, related_name='liked_posts', blank=True)
    # Guarda la fecha y hora de creación del post automáticamente.
    created_at = models.DateTimeField(auto_now_add=True)

    # Sobrescribimos el método 'save' para que genere el 'slug' automáticamente
    # a partir del título si no se ha proporcionado uno.
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    # La clase Meta nos permite añadir configuraciones adicionales al modelo.
    class Meta:
        # Ordena los posts por fecha de creación, del más nuevo al más viejo.
        ordering = ['-created_at']  # Ordenar de más nuevo a más viejo

    # Define cómo se mostrará un objeto Post en el panel de administración de Django.
    def __str__(self):
        return self.title


# --- Modelo para las Imágenes Adicionales de un Post ---
# Este modelo nos permite asociar múltiples imágenes a una sola publicación.
class PostImage(models.Model):
    # Relaciona cada imagen con un post. Si el post se borra, sus imágenes también.
    post = models.ForeignKey(
        Post, related_name='images', on_delete=models.CASCADE)
    # El campo para guardar el archivo de imagen. Se guarda en 'media/posts_images/gallery/'.
    image = models.ImageField(upload_to='posts_images/gallery/')
