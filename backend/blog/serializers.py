
from rest_framework import serializers
from .models import Post, PostImage


class PostImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostImage
        fields = ['id', 'image']


class PostSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(
        source='author.username')  # Muestra el nombre de usuario
    images = PostImageSerializer(many=True, read_only=True)
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(allow_empty_file=False, use_url=False),
        write_only=True, required=False
    )

    class Meta:
        model = Post
        fields = ['id', 'title', 'slug', 'author', 'content',
                  'image', 'images', 'created_at', 'uploaded_images']
        # Estos campos no se envían en el POST
        read_only_fields = ['slug', 'author', 'created_at', 'images']
