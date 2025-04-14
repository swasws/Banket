# halls/models.py

from django.db import models
from django.conf import settings


class Hall(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='halls',
        verbose_name='Владелец'
    )

    name = models.CharField('Название зала', max_length=255)
    description = models.TextField('Описание', blank=True)
    image = models.ImageField('Изображение', upload_to='halls_images/', blank=True, null=True)

    # Теги (банкет, конференц, etc.) можно хранить через ManyToMany или просто TextField
    tags = models.CharField('Теги', max_length=255, blank=True)

    price = models.DecimalField('Цена', max_digits=10, decimal_places=2, blank=True, null=True)

    capacity_min = models.PositiveIntegerField('Мин. вместимость', default=0)
    capacity_max = models.PositiveIntegerField('Макс. вместимость', default=0)

    address = models.CharField('Адрес', max_length=255, blank=True)

    # Еда: (от заведения/своя) - сделаем поле выбора
    FOOD_CHOICES = (
        ('venue', 'От заведения'),
        ('own', 'Своя'),
    )
    food_option = models.CharField('Еда', max_length=10, choices=FOOD_CHOICES, default='venue')

    # Алкоголь: (разрешено/запрещено)
    ALCOHOL_CHOICES = (
        ('allowed', 'Разрешено'),
        ('forbidden', 'Запрещено'),
    )
    alcohol_option = models.CharField('Алкоголь', max_length=10, choices=ALCOHOL_CHOICES, default='allowed')

    # Типы мероприятий (список), можно хранить в ManyToMany или просто в CharField через запятую
    event_types = models.CharField('Типы мероприятий', max_length=255, blank=True)

    # Обслуживание
    service = models.BooleanField('Обслуживание', default=False)

    # Правила
    rules = models.TextField('Правила', blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Зал'
        verbose_name_plural = 'Залы'

    def __str__(self):
        return f"{self.name} (Владелец: {self.owner.username})"
