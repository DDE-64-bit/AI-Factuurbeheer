from django.db import models

class Factuur(models.Model):
    winkel = models.CharField(max_length=128)
    totaalPrijs = models.DecimalField(decimal_places=2, max_digits=10)
    btw = models.DecimalField(max_length=10, decimal_places=2, max_digits=10)
    factuur = models.ImageField(upload_to='uploads/facturen/', max_length=100)
