from rest_framework import serializers
from .models import Factuur

class FactuurSerializer(serializers.Serializer):
    class Meta:
        model = Factuur
        fields = '__all__'

class FactuurImageSerializer(serializers.Serializer):
    file = serializers.FileField()