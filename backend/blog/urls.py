from django.urls import path
from .views import PostList, PostDetail, MyPostList, ToggleLikeView, LikedPostsListView

app_name = 'blog'

urlpatterns = [
    path('posts/', PostList.as_view(), name='post-list'),
    path('my-posts/', MyPostList.as_view(), name='my-post-list'),
    path('liked-posts/', LikedPostsListView.as_view(), name='liked-post-list'),
    path('posts/<slug:slug>/', PostDetail.as_view(), name='post-detail'),
    path('posts/<slug:slug>/like/', ToggleLikeView.as_view(), name='toggle-like'),
]
