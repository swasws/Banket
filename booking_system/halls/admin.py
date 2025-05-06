from django.contrib import admin
from .models import Hall, Booking, City, Comment


@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'hall_count')
    search_fields = ('name',)

    def hall_count(self, obj):
        return obj.halls.count()
    hall_count.short_description = 'Количество залов'


@admin.register(Hall)
class HallAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'name',
        'owner',
        'city',
        'price',
        'capacity_min',
        'capacity_max',
        'created_at'
    )
    list_filter = (
        'owner',
        'city',
        'food_option',
        'alcohol_option',
        'created_at'
    )
    search_fields = (
        'name',
        'owner__username',
        'address',
        'tags'
    )
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('id', 'event_name', 'hall', 'client', 'date', 'time', 'people_count')
    list_filter = ('date', 'hall', 'food_option')
    search_fields = ('event_name', 'client__username', 'hall__name')
    readonly_fields = ('created_at',)


admin.site.register(Comment)