from django.db import models

# Create your models here.
from django.db import models

class Component(models.Model):
    name = models.CharField(max_length=200)
    part_number = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    purchase_price = models.DecimalField(max_digits=10, decimal_places=2)
    repair_price = models.DecimalField(max_digits=10, decimal_places=2)
    stock_quantity = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.part_number})"