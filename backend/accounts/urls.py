from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token
from .views import UserRegistrationViewSet, ProfileView, CustomAuthToken

# El router de DRF genera automáticamente las URLs para los ViewSets.
router = DefaultRouter()
# Registra el UserRegistrationViewSet en la ruta 'register/'.
router.register(r'register', UserRegistrationViewSet,
                basename='user-registration')

# La lista de patrones de URL para la aplicación 'accounts'.
urlpatterns = [
    # Ruta para el registro: POST /api/v1/accounts/register/
    path('', include(router.urls)),
    # Ruta para el login: POST /api/v1/accounts/login/
    path('login/', CustomAuthToken.as_view(), name='api_token_auth'),
    # Ruta para el perfil: GET, PUT, PATCH /api/v1/accounts/profile/
    path('profile/', ProfileView.as_view(), name='user-profile'),
]
