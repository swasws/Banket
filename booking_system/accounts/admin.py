from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    # Настраиваем отображение полей в админке
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Личная информация', {'fields': ('email', 'full_name', 'organization_name')}),
        ('Роли и разрешения', {'fields': ('role', 'is_active', 'is_staff', 'is_superuser')}),
    )
    list_display = ('id', 'username', 'email', 'role', 'organization_name', 'full_name', 'is_active')
    search_fields = ('username', 'email', 'organization_name', 'full_name')
    ordering = ('id',)
