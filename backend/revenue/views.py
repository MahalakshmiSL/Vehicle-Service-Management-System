from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Sum
from django.db.models.functions import TruncDay, TruncMonth, TruncYear
from payments.models import Payment


@api_view(['GET'])
def daily_revenue(request):
    data = (
        Payment.objects.filter(status='paid')
        .annotate(date=TruncDay('paid_at'))
        .values('date')
        .annotate(revenue=Sum('amount'))
        .order_by('date')
    )
    return Response(data)


@api_view(['GET'])
def monthly_revenue(request):
    data = (
        Payment.objects.filter(status='paid')
        .annotate(month=TruncMonth('paid_at'))
        .values('month')
        .annotate(revenue=Sum('amount'))
        .order_by('month')
    )
    return Response(data)


@api_view(['GET'])
def yearly_revenue(request):
    data = (
        Payment.objects.filter(status='paid')
        .annotate(year=TruncYear('paid_at'))
        .values('year')
        .annotate(revenue=Sum('amount'))
        .order_by('year')
    )
    return Response(data)