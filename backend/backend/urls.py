from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic.base import RedirectView

urlpatterns = [
    path('', RedirectView.as_view(url='/api/v1/blog/posts/', permanent=False)),
    path('admin/', admin.site.urls),
    path('api/v1/accounts/', include('accounts.urls')),
    # Añadimos 'v1' para versionar la API
    path('api/v1/blog/', include('blog.urls')),
]

# Servir archivos multimedia en modo DEBUG
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
