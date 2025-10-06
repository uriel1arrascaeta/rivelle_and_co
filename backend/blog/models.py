
from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify


class Post(models.Model):
    title = models.CharField(max_length=200)
    # Usamos un slug para URLs amigables (ej: /blog/mi-primer-post)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    author = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='blog_posts')
    content = models.TextField()
    image = models.ImageField(upload_to='posts_images/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['-created_at']  # Ordenar de más nuevo a más viejo

    def __str__(self):
        return self.title


class PostImage(models.Model):
    post = models.ForeignKey(
        Post, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='posts_images/gallery/')
