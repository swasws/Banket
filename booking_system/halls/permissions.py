# halls/permissions.py
from rest_framework.permissions import BasePermission, SAFE_METHODS
from .models import Hall, Comment

class IsOwnerOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return request.user.is_authenticated
        return request.user.is_authenticated and request.user.role == 'owner'


class IsAuthorOrHallOwner(BasePermission):
    """
    Разрешает:
    - автору комментария: редактировать и удалять;
    - владельцу зала: только удалять.
    """

    def has_object_permission(self, request, view, obj: Comment):
        user = request.user

        # Автор комментария может делать всё
        if obj.user == user:
            return True

        # Владелец зала может только удалять
        if request.method == 'DELETE':
            return obj.hall.owner == user

        # Остальные действия запрещены
        return False
