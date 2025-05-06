# accounts/urls.py
from django.urls import path
from .views import (
    OwnerRegisterView,
    OwnerLoginView,
    ClientRegisterView,
    ClientLoginView
)

urlpatterns = [
    # Owner
    path('owner/register/', OwnerRegisterView.as_view(), name='owner_register'),
    path('owner/login/', OwnerLoginView.as_view(), name='owner_login'),

    # Client
    path('client/register/', ClientRegisterView.as_view(), name='client_register'),
    path('client/login/', ClientLoginView.as_view(), name='client_login'),
]
