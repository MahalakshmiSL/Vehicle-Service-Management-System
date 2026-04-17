from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from .models import Component
from .serializers import ComponentSerializer

class ComponentViewSet(viewsets.ModelViewSet):
    queryset = Component.objects.all().order_by('-created_at')
    serializer_class = ComponentSerializer