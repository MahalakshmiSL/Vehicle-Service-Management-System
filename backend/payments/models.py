from django.db import models
from vehicles.models import Vehicle

class Invoice(models.Model):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
    parts_total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    labor_total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    grand_total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)

class Payment(models.Model):
    STATUS_CHOICES = [('pending', 'Pending'), ('paid', 'Paid')]
    invoice = models.OneToOneField(Invoice, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    paid_at = models.DateTimeField(null=True, blank=True)