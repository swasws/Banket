from rest_framework.routers import DefaultRouter
from .views import HallViewSet, CityViewSet, BookingViewSet, NotificationViewSet, MessageViewSet, CommentViewSet

router = DefaultRouter()
router.register(r'halls', HallViewSet, basename='hall')
router.register(r'cities', CityViewSet, basename='city')
router.register(r'bookings', BookingViewSet, basename='booking')

router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'messages', MessageViewSet, basename='message')

router.register(r'comments', CommentViewSet, basename='comment')

urlpatterns = router.urls