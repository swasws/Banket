from django.db import models
from django.conf import settings


class City(models.Model):
    name = models.CharField('Город', max_length=100, unique=True)

    class Meta:
        verbose_name = 'Город'
        verbose_name_plural = 'Города'

    def __str__(self):
        return self.name


class Hall(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='halls',
        verbose_name='Владелец'
    )

    city = models.ForeignKey(
        City,
        on_delete=models.CASCADE,
        related_name='halls',
        verbose_name='Город',
        null=True
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


class Booking(models.Model):
    hall = models.ForeignKey(Hall, on_delete=models.CASCADE, related_name='bookings', verbose_name='Зал')
    client = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bookings', verbose_name='Клиент')

    event_name = models.CharField('Название мероприятия', max_length=255)
    date = models.DateField('Дата')
    time = models.TimeField('Время')
    people_count = models.PositiveIntegerField('Количество людей')
    food_option = models.CharField('Еда', max_length=10, choices=Hall.FOOD_CHOICES, default='venue')
    description = models.TextField('Описание', blank=True)
    is_payment_enabled = models.BooleanField(default=False)
    is_paid = models.BooleanField('Оплачено', default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    STATUS_CHOICES = [
        ('pending', 'Ожидает'),
        ('approved', 'Подтверждено'),
        ('rejected', 'Отклонено')
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    class Meta:
        verbose_name = 'Бронирование'
        verbose_name_plural = 'Бронирования'

    def __str__(self):
        return f"{self.event_name} ({self.date}) — {self.client}"


class Notification(models.Model):
    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Уведомление для {self.recipient.username}: {self.message[:40]}"


class Message(models.Model):
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    text = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['timestamp']



from django.db import models
from django.conf import settings

class Comment(models.Model):
    hall = models.ForeignKey('Hall', on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']  # ✅ теперь корректно

    def __str__(self):
        return f"Комментарий от {self.user.username} к залу {self.hall.name}"

