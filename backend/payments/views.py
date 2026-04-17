from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Invoice, Payment
from .serializers import InvoiceSerializer, PaymentSerializer
from issues.models import Issue
from django.utils import timezone
from decimal import Decimal


class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer

    @action(detail=False, methods=['post'])
    def generate(self, request):
        vehicle_id = request.data.get('vehicle_id')

        issues = Issue.objects.filter(vehicle_id=vehicle_id, status='open').prefetch_related('component_usages__component')

        if not issues.exists():
            return Response({"message": "No open issues found for this vehicle."}, status=400)

        parts_total = Decimal('0.00')
        labor_total = Decimal('0.00')

        for issue in issues:
            labor_total += Decimal(str(issue.labor_charge or 0))
            for usage in issue.component_usages.all():
                # use purchase_price for new parts, repair_price for repairs
                price = usage.component.purchase_price if usage.use_new_part else usage.component.repair_price
                parts_total += Decimal(str(price)) * usage.quantity

        grand_total = parts_total + labor_total

        invoice = Invoice.objects.create(
            vehicle_id=vehicle_id,
            parts_total=parts_total,
            labor_total=labor_total,
            grand_total=grand_total
        )

        payment = Payment.objects.create(
            invoice=invoice,
            amount=grand_total,
            status='pending'
        )

        issues.update(status='resolved')

        return Response({
            "invoice": InvoiceSerializer(invoice).data,
            "payment_id": payment.id
        })


class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

    @action(detail=True, methods=['post'])
    def pay(self, request, pk=None):
        payment = self.get_object()
        payment.status = 'paid'
        payment.paid_at = timezone.now()
        payment.save()

        if payment.invoice.vehicle:
            payment.invoice.vehicle.status = 'completed'
            payment.invoice.vehicle.save()

        return Response({'status': 'Payment successful'})