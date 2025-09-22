
from rest_framework import serializers
from .models import Post


class PostSerializer(serializers.ModelSerializer):
    # Para mostrar el nombre de usuario en lugar del ID
    author = serializers.ReadOnlyField(source='author.username')

    class Meta:
        model = Post
        # El 'lookup_field' será el slug, no el id.
        fields = ['id', 'title', 'slug', 'author', 'content', 'created_at']
