from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Profile


class UserSerializer(serializers.ModelSerializer):
    # Usaremos 'first_name' para el nombre completo que viene del frontend.
    # El campo 'name' no existe en el modelo User por defecto.
    name = serializers.CharField(source='first_name', write_only=True)
    role = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'password', 'name', 'role']
        extra_kwargs = {'password': {'write_only': True}}

    def validate_email(self, value):
        """
        Comprueba que el email no esté ya en uso.
        """
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "Un usuario con este email ya existe.")
        return value

    def create(self, validated_data):
        # Extraemos el rol antes de crear el usuario
        role = validated_data.pop('role', 'buyer')
        # Usamos el email como username para que sea único.
        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name']
        )
        # El perfil se crea automáticamente con la señal, aquí lo actualizamos.
        user.profile.role = role
        user.profile.save()
        return user


class ProfileSerializer(serializers.ModelSerializer):
    # Hacemos que el nombre y email sean de solo lectura para mostrarlos
    first_name = serializers.CharField(source='user.first_name')
    email = serializers.EmailField(source='user.email')

    class Meta:
        model = Profile
        fields = ['avatar', 'first_name', 'email']

    def update(self, instance, validated_data):
        # Maneja los datos del usuario anidado
        user_data = validated_data.pop('user', {})
        user = instance.user

        user.first_name = user_data.get('first_name', user.first_name)
        user.email = user_data.get('email', user.email)
        # Mantenemos el username sincronizado con el email
        user.username = user_data.get('email', user.username)
        user.save()

        # Actualiza el avatar en el perfil
        instance.avatar = validated_data.get('avatar', instance.avatar)
        instance.save()
        return instance
