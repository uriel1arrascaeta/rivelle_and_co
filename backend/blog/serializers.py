
from rest_framework import serializers
from .models import Post, PostImage


# --- Serializador para las Imágenes Adicionales ---
# Se encarga de convertir los objetos PostImage a formato JSON.
class PostImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostImage
        fields = ['id', 'image']


# --- Serializador para las Publicaciones (Posts) ---
# Es el serializador principal que maneja la conversión de datos de los posts.
class PostSerializer(serializers.ModelSerializer):
    # Campo de solo lectura que obtiene el nombre del autor a través de la relación.
    author = serializers.ReadOnlyField(source='author.first_name')
    # Campo anidado que usa PostImageSerializer para mostrar todas las imágenes adicionales.
    images = PostImageSerializer(many=True, read_only=True)
    # Campo virtual de solo escritura para recibir una lista de imágenes al crear un post.
    # No corresponde a un campo del modelo Post.
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(allow_empty_file=False, use_url=False),
        write_only=True, required=False
    )
    # Campo calculado que nos dirá si el usuario actual le ha dado "like" al post.
    is_liked = serializers.SerializerMethodField()
    # Campo de solo lectura que cuenta cuántos "likes" tiene el post.
    total_likes = serializers.IntegerField(
        source='likes.count', read_only=True)

    class Meta:
        model = Post
        # Lista de todos los campos que se incluirán en la respuesta de la API.
        fields = ['id', 'title', 'slug', 'author', 'content',
                  'image', 'images', 'created_at', 'uploaded_images', 'is_liked', 'total_likes']
        # Campos que no se pueden modificar directamente a través de la API.
        read_only_fields = ['slug', 'author', 'created_at',
                            'images', 'is_liked', 'total_likes']

    # Método que calcula el valor del campo 'is_liked'.
    def get_is_liked(self, obj):
        # Obtenemos el usuario que hace la petición desde el "contexto".
        user = self.context['request'].user
        # Si el usuario está autenticado, comprobamos si su ID está en la lista de "likes" del post.
        if user.is_authenticated:
            return obj.likes.filter(id=user.id).exists()
        return False

    # Sobrescribimos el método 'create' para manejar la creación del post y sus imágenes adicionales.
    def create(self, validated_data):
        # Sacamos las imágenes adicionales de los datos validados para que no den error al crear el Post.
        uploaded_images = validated_data.pop('uploaded_images', [])
        # Creamos el objeto Post con el resto de los datos.
        post = Post.objects.create(**validated_data)
        # Recorremos la lista de imágenes subidas y creamos un objeto PostImage para cada una.
        for image in uploaded_images:
            PostImage.objects.create(post=post, image=image)
        return post
