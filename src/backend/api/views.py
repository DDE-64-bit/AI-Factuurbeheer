from django.shortcuts import render
from django.http import HttpResponse
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


class VerwijderFacturen(APIView):
    def delete(self, request):
        aantal = Factuur.objects.count()
        Factuur.objects.all().delete()
        return Response({"message": f"{aantal} facturen verwijderd."}, status=200)


class UploadImage(APIView):
    def post(self, request):
        serializer = FactuurImageSerializer(data=request.data)
        if serializer.is_valid():
            instance = serializer.save()
            # print(f"Saved at: {instance.factuur.path}")
            
            return Response({'message': 'Upload geslaagd!'}, status=201)
        else:
            print("Serializer errors:", serializer.errors)
            return Response(serializer.errors, status=400)
