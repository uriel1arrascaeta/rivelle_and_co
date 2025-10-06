from django.urls import path
from .views import PostList, PostDetail, MyPostList

app_name = 'blog'

urlpatterns = [
    path('posts/', PostList.as_view(), name='post-list'),
    path('my-posts/', MyPostList.as_view(), name='my-post-list'),
    path('posts/<slug:slug>/', PostDetail.as_view(), name='post-detail'),
]
