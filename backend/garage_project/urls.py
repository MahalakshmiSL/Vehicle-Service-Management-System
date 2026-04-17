from django.contrib import admin
from django.urls import path, include
from revenue import views as rev_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('components.urls')),
    path('api/', include('vehicles.urls')),
    path('api/', include('issues.urls')),
    path('api/', include('payments.urls')),
    path('api/revenue/', include('revenue.urls')),
    path('api/revenue/daily/', rev_views.daily_revenue),
    path('api/revenue/monthly/', rev_views.monthly_revenue),
    path('api/revenue/yearly/', rev_views.yearly_revenue),
]