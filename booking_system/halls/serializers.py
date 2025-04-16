# halls/serializers.py
from rest_framework import serializers
from .models import Hall, City, Notification


class HallSerializer(serializers.ModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(read_only=True)
    city = serializers.PrimaryKeyRelatedField(queryset=City.objects.all())

    class Meta:
        model = Hall
        fields = [
            'id', 'owner', 'name', 'description', 'image', 'tags', 'price',
            'capacity_min', 'capacity_max', 'address', 'food_option', 'alcohol_option',
            'event_types', 'service', 'rules', 'city',
            'created_at', 'updated_at',
        ]
        read_only_fields = ('owner', 'created_at', 'updated_at')


class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = ['id', 'name']


from .models import Booking

class BookingSerializer(serializers.ModelSerializer):
    client = serializers.PrimaryKeyRelatedField(read_only=True)
    hall_name = serializers.CharField(source='hall.name', read_only=True)
    date = serializers.DateField()
    time = serializers.TimeField()

    class Meta:
        model = Booking
        fields = [
            'id', 'hall', 'hall_name', 'client',
            'event_name', 'date', 'time',
            'people_count', 'food_option',
            'description', 'status', 'created_at'
        ]
        read_only_fields = ['client', 'created_at', 'status']


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'message', 'is_read', 'created_at']


from .models import Message

class MessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source='sender.username', read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'booking', 'sender', 'sender_username', 'text', 'timestamp']
        read_only_fields = ['sender', 'timestamp']
