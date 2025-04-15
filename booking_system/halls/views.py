# halls/views.py
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny
from .models import Hall, Notification
from .serializers import HallSerializer, NotificationSerializer
from .permissions import IsOwnerOrReadOnly
from .models import City
from .serializers import CitySerializer
from rest_framework.decorators import action
from rest_framework.response import Response



class HallViewSet(ModelViewSet):
    queryset = Hall.objects.all()
    serializer_class = HallSerializer
    permission_classes = [IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def get_queryset(self):
        # Клиенты видят все залы
        return Hall.objects.all()


class CityViewSet(ModelViewSet):
    queryset = City.objects.all()
    serializer_class = CitySerializer



# halls/views.py

from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Booking, Hall
from .serializers import BookingSerializer
from rest_framework.viewsets import ModelViewSet

class BookingViewSet(ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        booking = serializer.save(client=self.request.user)

        # Уведомление владельцу
        from .models import Notification
        Notification.objects.create(
            recipient=booking.hall.owner,
            message=f'Новая бронь: "{booking.event_name}" от клиента {booking.client.username}'
        )

    def get_queryset(self):
        user = self.request.user
        if user.role == 'client':
            return Booking.objects.filter(client=user)
        return Booking.objects.none()

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        booking = self.get_object()
        if booking.hall.owner != request.user:
            return Response({'error': 'Нет доступа'}, status=403)

        booking.status = 'approved'
        booking.save()

        from .models import Notification
        Notification.objects.create(
            recipient=booking.client,
            message=f'Владелец подтвердил бронь: "{booking.event_name}"'
        )
        return Response({'message': 'Бронь подтверждена.'})

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        booking = self.get_object()
        if booking.hall.owner != request.user:
            return Response({'error': 'Нет доступа'}, status=403)

        booking.status = 'rejected'
        booking.save()

        from .models import Notification
        Notification.objects.create(
            recipient=booking.client,
            message=f'Владелец отклонил бронь: "{booking.event_name}"'
        )
        return Response({'message': 'Бронь отклонена.'})

    @action(detail=False, methods=['get'], url_path='by-hall/(?P<hall_id>[^/.]+)')
    def by_hall(self, request, hall_id=None):
        try:
            hall = Hall.objects.get(id=hall_id)
        except Hall.DoesNotExist:
            return Response({'error': 'Зал не найден.'}, status=404)

        if hall.owner != request.user:
            return Response({'error': 'Нет доступа к этому залу.'}, status=403)

        bookings = Booking.objects.filter(hall=hall)
        serializer = self.get_serializer(bookings, many=True)
        return Response(serializer.data)



class NotificationViewSet(ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer

    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user).order_by('-created_at')