from django.db import models

class Factuur(models.Model):
    factuur = models.FileField(upload_to='facturen/')
    bedragVoorBtw = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    bedragNaBtw = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    datum = models.DateField(null=True, blank=True)
    leverancier = models.CharField(max_length=255, null=True, blank=True)