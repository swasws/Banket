# halls/admin.py
from django.contrib import admin
from .models import Hall

@admin.register(Hall)
class HallAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'name',
        'owner',
        'price',
        'capacity_min',
        'capacity_max',
        'created_at'
    )
    list_filter = (
        'owner',
        'food_option',
        'alcohol_option',
        'created_at'
    )
    search_fields = (
        'name',
        'owner__username',
        'address',
        'tags'
    )
    readonly_fields = ('created_at', 'updated_at')
