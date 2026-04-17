from django.db import models
from vehicles.models import Vehicle
from components.models import Component

class Issue(models.Model):
    SERVICE_TYPES = [('new_part', 'New Part'), ('repair', 'Repair Service')]
    STATUS_CHOICES = [('open', 'Open'), ('resolved', 'Resolved')]

    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='issues')
    description = models.TextField()
    service_type = models.CharField(max_length=20, choices=SERVICE_TYPES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    labor_charge = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Issue on {self.vehicle} - {self.description[:40]}"

class ComponentUsage(models.Model):
    issue = models.ForeignKey(Issue, on_delete=models.CASCADE, related_name='component_usages')
    component = models.ForeignKey(Component, on_delete=models.CASCADE)
    use_new_part = models.BooleanField(default=True)
    parts_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    quantity = models.IntegerField(default=1)

    def get_price(self):
        price = self.component.purchase_price if self.use_new_part else self.component.repair_price
        return price * self.quantity