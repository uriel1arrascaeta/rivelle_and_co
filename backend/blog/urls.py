
from django.urls import path
from .views import PostList, PostDetail

urlpatterns = [
    path('posts/', PostList.as_view(), name='post_list'),
    # Esperamos un slug en la URL, ej: /api/v1/blog/posts/mi-primer-post/
    path('posts/<slug:slug>/', PostDetail.as_view(), name='post_detail'),
]
