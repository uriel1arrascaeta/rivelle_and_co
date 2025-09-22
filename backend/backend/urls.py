from django.contrib import admin
from django.urls import path, include
from django.views.generic.base import RedirectView

urlpatterns = [
    path('', RedirectView.as_view(url='/api/v1/blog/posts/', permanent=False)),
    path('admin/', admin.site.urls),
    # Añadimos 'v1' para versionar la API
    path('api/v1/blog/', include('blog.urls')),
]
