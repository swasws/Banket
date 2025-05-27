# halls/views.py
from .serializers import HallSerializer
from .permissions import IsOwnerOrReadOnly
from .models import City
from .serializers import CitySerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.viewsets import ModelViewSet
from .models import Booking, Hall, Notification
from .serializers import BookingSerializer, NotificationSerializer
from rest_framework import viewsets, permissions
from .models import Message
from .serializers import MessageSerializer


class HallViewSet(ModelViewSet):
    queryset = Hall.objects.all().select_related('city')
    serializer_class = HallSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def get_queryset(self):
        # Клиенты видят все залы
        return Hall.objects.all()


class CityViewSet(ModelViewSet):
    queryset = City.objects.all()
    serializer_class = CitySerializer


class BookingViewSet(ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'client':
            return Booking.objects.filter(client=user)
        elif user.role == 'owner':
            return Booking.objects.filter(hall__owner=user)
        return Booking.objects.none()

    def perform_create(self, serializer):
        booking = serializer.save(client=self.request.user)
        # Уведомление владельцу зала
        Notification.objects.create(
            recipient=booking.hall.owner,
            message=f'Новая заявка на "{booking.hall.name}" от {booking.client.username}'
        )

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

        # ✅ теперь можно отменить даже если бронь уже была подтверждена
        if booking.status == 'rejected':
            return Response({'error': 'Бронь уже отклонена.'}, status=400)

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
            return Response({'error': 'Зал не найден'}, status=404)

        if hall.owner != request.user:
            return Response({'error': 'Нет доступа к этому залу'}, status=403)

        bookings = Booking.objects.filter(hall=hall)
        serializer = self.get_serializer(bookings, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], url_path='enable-payment')
    def enable_payment(self, request, pk=None):
        booking = self.get_object()
        if booking.hall.owner != request.user:
            return Response({'error': 'Нет доступа'}, status=403)

        booking.is_payment_enabled = True
        booking.save()
        Notification.objects.create(
            recipient=booking.client,
            message=f"Владелец зала разрешил оплату бронирования '{booking.event_name}'."
        )
        return Response({'message': 'Оплата разрешена'})

    @action(detail=True, methods=['post'], url_path='pay')
    def pay(self, request, pk=None):
        booking = self.get_object()
        if booking.client != request.user:
            return Response({'error': 'Нет доступа'}, status=403)

        if not booking.is_payment_enabled:
            return Response({'error': 'Оплата не разрешена'}, status=400)

        booking.is_paid = True
        booking.save()

        Notification.objects.create(
            recipient=booking.hall.owner,
            message=f"Клиент {booking.client.username} оплатил бронирование '{booking.event_name}'."
        )

        return Response({'message': 'Оплата прошла успешно'})


class NotificationViewSet(ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user).order_by('-created_at')


class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        booking_id = self.request.query_params.get('booking')
        return Message.objects.filter(booking_id=booking_id)

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)


from rest_framework import viewsets, permissions
from .models import Comment
from .serializers import CommentSerializer

class IsAuthorOrHallOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user or obj.hall.owner == request.user

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated, IsAuthorOrHallOwner]

    def get_queryset(self):
        hall_id = self.request.query_params.get('hall')
        if hall_id:
            return Comment.objects.filter(hall_id=hall_id).order_by('-created_at')
        return Comment.objects.all()

    def perform_create(self, serializer):
        hall_id = self.request.data.get('hall')
        serializer.save(user=self.request.user, hall_id=hall_id)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        # 👇 вот это обязательно!
        self.check_object_permissions(request, instance)

        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)


