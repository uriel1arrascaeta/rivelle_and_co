from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic.base import RedirectView

# La lista principal de patrones de URL para todo el proyecto.
urlpatterns = [
    # Redirige la ruta raíz (ej: http://127.0.0.1:8000/) a la lista de posts del blog.
    path('', RedirectView.as_view(url='/api/v1/blog/posts/', permanent=False)),
    # La ruta para el panel de administración de Django.
    path('admin/', admin.site.urls),
    # Incluye todas las URLs definidas en la aplicación 'accounts' bajo el prefijo 'api/v1/accounts/'.
    path('api/v1/accounts/', include('accounts.urls')),
    # Incluye todas las URLs definidas en la aplicación 'blog' bajo el prefijo 'api/v1/blog/'.
    path('api/v1/blog/', include('blog.urls')),
]

# Servir archivos multimedia en modo DEBUG
# Esta configuración es solo para el entorno de desarrollo.
# Permite que el servidor de Django muestre las imágenes que los usuarios suben.
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
