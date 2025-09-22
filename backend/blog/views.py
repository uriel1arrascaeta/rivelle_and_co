# blog/views.py
from rest_framework import generics
from .models import Post
from .serializers import PostSerializer


class PostList(generics.ListAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer


class PostDetail(generics.RetrieveAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    # Le decimos a la vista que busque los posts por el campo 'slug' en la URL
    lookup_field = 'slug'
