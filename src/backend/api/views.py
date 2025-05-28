from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import FactuurSerializer
from .models import Factuur

class GetFacturen(APIView):
    def get(self, request):
        facturen = Factuur.objects.all()
        serializer = FactuurSerializer(facturen, many=True)

        return Response(serializer.data, status=200)

class AddFactuur(APIView):
    def post(self, request):
        serializer = FactuurSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.data, status=500)
