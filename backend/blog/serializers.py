
from rest_framework import serializers
from .models import Post, PostImage


class PostImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostImage
        fields = ['id', 'image']


class PostSerializer(serializers.ModelSerializer):
    # Cambiamos 'author.username' por 'author.first_name' para mostrar el nombre.
    author = serializers.ReadOnlyField(source='author.first_name')
    images = PostImageSerializer(many=True, read_only=True)
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(allow_empty_file=False, use_url=False),
        write_only=True, required=False
    )
    is_liked = serializers.SerializerMethodField()
    total_likes = serializers.IntegerField(
        source='likes.count', read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'title', 'slug', 'author', 'content',
                  'image', 'images', 'created_at', 'uploaded_images', 'is_liked', 'total_likes']
        # Estos campos no se envían en el POST
        read_only_fields = ['slug', 'author', 'created_at',
                            'images', 'is_liked', 'total_likes']

    def get_is_liked(self, obj):
        user = self.context['request'].user
        if user.is_authenticated:
            return obj.likes.filter(id=user.id).exists()
        return False

    def create(self, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        post = Post.objects.create(**validated_data)
        for image in uploaded_images:
            PostImage.objects.create(post=post, image=image)
        return post
