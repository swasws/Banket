# halls/serializers.py
from rest_framework import serializers
from .models import Hall, City, Notification


class HallSerializer(serializers.ModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(read_only=True)
    city = serializers.PrimaryKeyRelatedField(queryset=City.objects.all())
    city_name = serializers.SerializerMethodField()

    class Meta:
        model = Hall
        fields = [
            'id', 'owner', 'name', 'description', 'image', 'tags', 'price',
            'capacity_min', 'capacity_max', 'address', 'food_option', 'alcohol_option',
            'event_types', 'service', 'rules', 'city', 'city_name',
            'created_at', 'updated_at',
        ]
        read_only_fields = ('owner', 'created_at', 'updated_at')

    def get_city_name(self, obj):
        return obj.city.name if obj.city else None

class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = ['id', 'name']


from .models import Booking


class BookingSerializer(serializers.ModelSerializer):
    is_payment_enabled = serializers.BooleanField(read_only=True)
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
            'description', 'status', 'created_at',
            'is_payment_enabled', 'is_paid'
        ]
        read_only_fields = ['client', 'created_at', 'status', 'is_paid']

    def get_is_payment_enabled(self, obj):
        # 👇 здесь твоя логика. Пример: включить оплату, если есть одобрение
        return obj.status == 'approved'


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


from rest_framework import serializers
from .models import Comment

class CommentSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'hall', 'user', 'user_username', 'text', 'created_at']
        read_only_fields = ['id', 'user', 'hall', 'user_username', 'created_at']

