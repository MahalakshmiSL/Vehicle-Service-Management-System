# issues/views.py
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Issue, ComponentUsage
from .serializers import IssueSerializer, ComponentUsageSerializer


class IssueViewSet(viewsets.ModelViewSet):
    queryset = Issue.objects.all().order_by('-created_at')
    serializer_class = IssueSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['vehicle', 'status', 'service_type']


class ComponentUsageViewSet(viewsets.ModelViewSet):
    queryset = ComponentUsage.objects.all()
    serializer_class = ComponentUsageSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['issue']