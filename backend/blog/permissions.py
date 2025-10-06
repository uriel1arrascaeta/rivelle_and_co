from rest_framework import permissions


class IsAuthorOrReadOnly(permissions.BasePermission):
    """
    Permiso personalizado para solo permitir a los autores de un objeto editarlo o borrarlo.
    """

    def has_object_permission(self, request, view, obj):
        # Los permisos de lectura se permiten para cualquier petición (GET, HEAD, OPTIONS).
        if request.method in permissions.SAFE_METHODS:
            return True

        # Los permisos de escritura solo se permiten al autor del post.
        return obj.author == request.user
