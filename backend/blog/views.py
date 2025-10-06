# blog/views.py
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from .models import Post, PostImage
from .serializers import PostSerializer
from .permissions import IsAuthorOrReadOnly


class PostList(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    parser_classes = [MultiPartParser, FormParser]  # Para aceptar archivos

    def perform_create(self, serializer):
        # Asigna automáticamente el usuario autenticado como autor del post.
        post = serializer.save(author=self.request.user)

        # Guarda las imágenes adicionales
        uploaded_images = self.request.FILES.getlist('uploaded_images')
        for image in uploaded_images:
            PostImage.objects.create(post=post, image=image)


class MyPostList(generics.ListAPIView):
    """
    Lista los posts creados por el usuario autenticado.
    """
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Post.objects.filter(author=self.request.user)


class PostDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthorOrReadOnly]
    # Le decimos a la vista que busque los posts por el campo 'slug' en la URL
    lookup_field = 'slug'
