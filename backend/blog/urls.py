from django.urls import path
from .views import PostList, PostDetail, MyPostList, ToggleLikeView, LikedPostsListView

# Define un nombre de espacio para estas URLs, útil para referenciarlas en otras partes de Django.
app_name = 'blog'

# La lista de patrones de URL para la aplicación 'blog'.
urlpatterns = [
    # /api/v1/blog/posts/ -> Muestra la lista de posts (GET) o crea uno nuevo (POST).
    path('posts/', PostList.as_view(), name='post-list'),
    # /api/v1/blog/my-posts/ -> Muestra solo los posts del usuario autenticado.
    path('my-posts/', MyPostList.as_view(), name='my-post-list'),
    # /api/v1/blog/liked-posts/ -> Muestra los posts que le gustaron al usuario.
    path('liked-posts/', LikedPostsListView.as_view(), name='liked-post-list'),
    # /api/v1/blog/posts/<slug>/ -> Muestra, edita o borra un post específico.
    path('posts/<slug:slug>/', PostDetail.as_view(), name='post-detail'),
    # /api/v1/blog/posts/<slug>/like/ -> Añade o quita un "like" a un post.
    path('posts/<slug:slug>/like/', ToggleLikeView.as_view(), name='toggle-like'),
]
