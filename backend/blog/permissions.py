from rest_framework import permissions


# --- Permiso Personalizado: Solo el Autor Puede Editar/Borrar ---
class IsAuthorOrReadOnly(permissions.BasePermission):
    """
    Permiso personalizado para solo permitir a los autores de un objeto editarlo o borrarlo.
    """

    # Este método se llama para comprobar si un usuario tiene permiso sobre un objeto específico (ej. un post).
    def has_object_permission(self, request, view, obj):
        # 'SAFE_METHODS' son métodos que no modifican datos (GET, HEAD, OPTIONS).
        # Si la petición es de solo lectura, se permite el acceso a cualquiera.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Si la petición es de escritura (POST, PUT, PATCH, DELETE),
        # solo se permite si el autor del objeto ('obj.author') es el mismo que el usuario que hace la petición.
        # Los permisos de escritura solo se permiten al autor del post.
        return obj.author == request.user
