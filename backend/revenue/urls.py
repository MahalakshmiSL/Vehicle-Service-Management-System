from django.urls import path
from .views import daily_revenue, monthly_revenue, yearly_revenue

urlpatterns = [
    path('daily/', daily_revenue),
    path('monthly/', monthly_revenue),
    path('yearly/', yearly_revenue),
]