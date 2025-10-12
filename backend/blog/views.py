# blog/views.py
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from .models import Post, PostImage
from .serializers import PostSerializer
from .permissions import IsAuthorOrReadOnly


# --- Vista para Listar y Crear Posts ---
# Hereda de una clase genérica que ya sabe cómo listar (GET) y crear (POST) objetos.
class PostList(generics.ListCreateAPIView):
    # El conjunto de datos base que esta vista manejará (todos los posts).
    queryset = Post.objects.all()
    # Le dice a la vista qué serializador usar para convertir los datos.
    serializer_class = PostSerializer
    # Define quién puede acceder: cualquiera puede ver (GET), pero solo usuarios autenticados pueden crear (POST).
    permission_classes = [IsAuthenticatedOrReadOnly]
    # Define los "parsers" que la vista puede usar. Son necesarios para poder subir archivos (imágenes).
    parser_classes = [MultiPartParser, FormParser]  # Para aceptar archivos

    # Pasa información extra (el objeto 'request') al serializador.
    # Es útil para que el serializador pueda acceder a datos del usuario actual.
    def get_serializer_context(self):
        return {'request': self.request}

    # Este método se ejecuta justo antes de guardar un nuevo objeto.
    def perform_create(self, serializer):
        # Asigna automáticamente el usuario autenticado como autor del post.
        serializer.save(author=self.request.user)


# --- Vista para Listar los Posts de un Usuario Específico ---
class MyPostList(generics.ListAPIView):
    """
    Lista los posts creados por el usuario autenticado.
    """
    serializer_class = PostSerializer
    # Solo usuarios autenticados pueden acceder a esta vista.
    permission_classes = [IsAuthenticated]

    # Sobrescribimos este método para devolver solo los posts cuyo autor es el usuario actual.
    def get_queryset(self):
        return Post.objects.filter(author=self.request.user)


# --- Vista para Ver, Actualizar y Borrar un Post Específico ---
# Hereda de una clase que maneja GET (ver), PUT/PATCH (actualizar) y DELETE (borrar).
class PostDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    # Usa nuestro permiso personalizado: cualquiera puede ver, pero solo el autor puede editar o borrar.
    permission_classes = [IsAuthorOrReadOnly]
    # Le dice a la vista que use el campo 'slug' de la URL para encontrar el post.
    lookup_field = 'slug'

    # También pasa el 'request' al serializador, necesario para el campo 'is_liked'.
    def get_serializer_context(self):
        return {'request': self.request}


# --- Vista para Listar los Posts que le Gustaron a un Usuario ---
class LikedPostsListView(generics.ListAPIView):
    """
    Devuelve una lista de los posts que le han gustado al usuario autenticado.
    """
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    # Devuelve la lista de posts que están en la relación 'liked_posts' del usuario actual.
    def get_queryset(self):
        return self.request.user.liked_posts.all()


# --- Vista para la Acción de "Me Gusta" ---
# Hereda de la clase base 'APIView' para tener control total sobre la lógica.
class ToggleLikeView(APIView):
    """
    Añade o quita un "like" de un post para el usuario autenticado.
    """
    permission_classes = [IsAuthenticated]

    # Este método se ejecuta cuando se recibe una petición POST.
    def post(self, request, slug):
        # Busca el post por su 'slug'. Si no lo encuentra, devuelve un error 404.
        post = generics.get_object_or_404(Post, slug=slug)
        # Comprueba si el usuario ya le ha dado "like" al post.
        if post.likes.filter(id=request.user.id).exists():
            # Si ya le dio "like", lo quita.
            post.likes.remove(request.user)
        else:
            # Si no le ha dado "like", lo añade.
            post.likes.add(request.user)
        # Devuelve una respuesta vacía con un código 204 (No Content), indicando que la acción fue exitosa.
        return Response(status=status.HTTP_204_NO_CONTENT)
