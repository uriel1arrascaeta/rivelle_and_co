from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Profile


# --- Serializador para el Registro de Nuevos Usuarios ---
class UserSerializer(serializers.ModelSerializer):
    # Campo virtual 'name' que mapea al campo 'first_name' del modelo User.
    # Es de solo escritura ('write_only') porque solo lo necesitamos para el registro.
    name = serializers.CharField(source='first_name', write_only=True)
    # Campo virtual 'role' para recibir el rol durante el registro.
    role = serializers.CharField(write_only=True)

    class Meta:
        model = User
        # Campos que el serializador aceptará y devolverá.
        fields = ['id', 'email', 'password', 'name', 'role']
        # Configuración extra para el campo 'password' para que nunca se devuelva en las respuestas de la API.
        extra_kwargs = {'password': {'write_only': True}}

    # Método de validación para el campo 'email'.
    def validate_email(self, value):
        """
        Comprueba que el email no esté ya en uso.
        """
        # Si ya existe un usuario con este email, lanza un error de validación.
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "Un usuario con este email ya existe.")
        return value

    # Sobrescribimos el método 'create' para manejar la lógica de creación personalizada.
    def create(self, validated_data):
        # Extraemos el rol antes de crear el usuario
        role = validated_data.pop('role', 'buyer')
        # Creamos el usuario usando el método 'create_user' que encripta la contraseña.
        # Usamos el email como 'username' para asegurar que sea único.
        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name']
        )
        # La señal ya creó un perfil básico, aquí actualizamos ese perfil con el rol seleccionado.
        user.profile.role = role
        user.profile.save()
        return user


# --- Serializador para el Perfil de Usuario ---
class ProfileSerializer(serializers.ModelSerializer):
    # Campos que obtienen datos del modelo User relacionado.
    # 'source' indica de dónde sacar el dato.
    first_name = serializers.CharField(source='user.first_name')
    email = serializers.EmailField(source='user.email')

    class Meta:
        model = Profile
        # Campos que se incluirán en la respuesta de la API para el perfil.
        fields = ['avatar', 'first_name', 'email']

    # Sobrescribimos el método 'update' para manejar la actualización del perfil y del usuario anidado.
    def update(self, instance, validated_data):
        # Extrae los datos que pertenecen al modelo User.
        user_data = validated_data.pop('user', {})
        user = instance.user

        # Actualiza los campos del modelo User.
        user.first_name = user_data.get('first_name', user.first_name)
        user.email = user_data.get('email', user.email)
        # Mantenemos el 'username' sincronizado con el 'email' para consistencia.
        user.username = user_data.get('email', user.username)
        user.save()

        # Actualiza el campo 'avatar' del modelo Profile.
        instance.avatar = validated_data.get('avatar', instance.avatar)
        instance.save()
        return instance
