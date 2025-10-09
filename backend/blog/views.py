# blog/views.py
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from .models import Post, PostImage
from .serializers import PostSerializer
from .permissions import IsAuthorOrReadOnly


class PostList(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    parser_classes = [MultiPartParser, FormParser]  # Para aceptar archivos

    def get_serializer_context(self):
        # Pasa el request al serializador para que pueda saber si el usuario le dio like
        return {'request': self.request}

    def perform_create(self, serializer):
        # Asigna automáticamente el usuario autenticado como autor del post.
        serializer.save(author=self.request.user)


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

    def get_serializer_context(self):
        return {'request': self.request}


class LikedPostsListView(generics.ListAPIView):
    """
    Devuelve una lista de los posts que le han gustado al usuario autenticado.
    """
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.request.user.liked_posts.all()


class ToggleLikeView(APIView):
    """
    Añade o quita un "like" de un post para el usuario autenticado.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, slug):
        post = generics.get_object_or_404(Post, slug=slug)
        if post.likes.filter(id=request.user.id).exists():
            post.likes.remove(request.user)
        else:
            post.likes.add(request.user)
        return Response(status=status.HTTP_204_NO_CONTENT)
