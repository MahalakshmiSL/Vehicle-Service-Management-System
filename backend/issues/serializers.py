# issues/serializers.py
from rest_framework import serializers
from .models import Issue, ComponentUsage


class ComponentUsageSerializer(serializers.ModelSerializer):
    # Read-only enriched fields for display
    component_name = serializers.CharField(source='component.name', read_only=True)
    component_part_number = serializers.CharField(source='component.part_number', read_only=True)
    price = serializers.SerializerMethodField()

    class Meta:
        model = ComponentUsage
        fields = '__all__'

    def get_price(self, obj):
        price = obj.component.purchase_price if obj.use_new_part else obj.component.repair_price
        return float(price) * obj.quantity


class IssueSerializer(serializers.ModelSerializer):
    component_usages = ComponentUsageSerializer(many=True, read_only=True)

    class Meta:
        model = Issue
        fields = '__all__'