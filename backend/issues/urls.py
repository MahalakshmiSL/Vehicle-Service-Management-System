from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import IssueViewSet, ComponentUsageViewSet

router = DefaultRouter()
router.register(r'issues', IssueViewSet)
router.register(r'component-usages', ComponentUsageViewSet)

urlpatterns = [path('', include(router.urls))]