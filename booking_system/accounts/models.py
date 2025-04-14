from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    # Роли пользователей
    ROLE_CHOICES = (
        ('owner', 'Владелец'),
        ('client', 'Клиент'),
    )
    role = models.CharField(
        max_length=10,
        choices=ROLE_CHOICES,
        default='client'
    )

    # Поле для имени заведения (только для владельца):
    organization_name = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    # Поле для ФИО / полного имени (только для клиента):
    full_name = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    def __str__(self):
        return self.username
