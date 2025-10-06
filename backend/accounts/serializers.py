from django.contrib.auth.models import User
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    # Usaremos 'first_name' para el nombre completo que viene del frontend.
    # El campo 'name' no existe en el modelo User por defecto.
    name = serializers.CharField(source='first_name', write_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'password', 'name']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # Usamos el email como username para que sea único.
        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name']
        )
        return user
