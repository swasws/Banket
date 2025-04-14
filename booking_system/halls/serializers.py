# halls/serializers.py
from rest_framework import serializers
from .models import Hall


class HallSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hall
        fields = (
            'id',
            'owner',
            'name',
            'description',
            'image',
            'tags',
            'price',
            'capacity_min',
            'capacity_max',
            'address',
            'food_option',
            'alcohol_option',
            'event_types',
            'service',
            'rules',
            'created_at',
            'updated_at',
        )
        read_only_fields = ('owner', 'created_at', 'updated_at')

    # Можно добавить валидацию, если нужно
