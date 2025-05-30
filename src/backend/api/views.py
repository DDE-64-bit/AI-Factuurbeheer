from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import FactuurSerializer, FactuurImageSerializer
from .models import Factuur

from agent.LLM import runLLM
from agent.Config import ModelConfig

ModelConfig.setDefaultModel('llava:7b', False)

class GetFacturen(APIView):
    def get(self, request):
        facturen = Factuur.objects.all()
        serializer = FactuurSerializer(facturen, many=True)

        return Response(serializer.data, status=200)


class UploadImage(APIView):
    def post(self, request):
        serializer = FactuurImageSerializer(data=request.data)
        if serializer.is_valid():
            image = serializer.validated_data['factuur']
            
        return Response(1234)