from rest_framework.routers import DefaultRouter
from .views import HallViewSet

router = DefaultRouter()
router.register(r'halls', HallViewSet, basename='hall')

urlpatterns = router.urls
