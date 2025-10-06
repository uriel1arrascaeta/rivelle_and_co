from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token
from .views import UserRegistrationViewSet

router = DefaultRouter()
router.register(r'register', UserRegistrationViewSet,
                basename='user-registration')

urlpatterns = [
    # Ruta para el registro: POST /api/v1/accounts/register/
    path('', include(router.urls)),
    # Ruta para el login: POST /api/v1/accounts/login/
    path('login/', obtain_auth_token, name='api_token_auth'),
]
