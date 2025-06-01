from rest_framework import serializers
from .models import Factuur

from agent.LLM import runLLM
from agent.Config import ModelConfig

import json
from openai import OpenAI
from dotenv import load_dotenv
import base64
import os

env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../.env'))
load_dotenv(dotenv_path=env_path)

client = OpenAI()

class FactuurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Factuur
        fields = '__all__'

class FactuurImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Factuur
        fields = ['factuur']

    def create(self, validatedData):
        instance = Factuur.objects.create(factuur=validatedData['factuur'])

        data = self.extractFactuurData(instance.factuur.path)

        instance.bedragVoorBtw = data.get('bedragVoorBtw')
        instance.bedragNaBtw = data.get('bedragNaBtw')
        instance.datum = data.get('datum')
        instance.leverancier = data.get('leverancier')
        instance.save()

        return instance

    def extractFactuurData(self, path):
        # print(f"Running analysis on: {path}")
        
        prompt = f"""
        You need to extract specific data from the provided image of a receipt or invoice.

        Return ONLY valid JSON in this exact format:
        {{
        "bedragVoorBtw": float,
        "bedragNaBtw": float,
        "datum": "YYYY-MM-DD",
        "leverancier": "string"
        }}

        Make sure:
        - The 'bedrag' is the total amount paid (use a float).
        - The 'datum' is the date in YYYY-MM-DD format.
        - The 'leverancier' is the name of the vendor or supplier.

        Do not include anything else but valid JSON especially not ``` json or anything that comes close to that.
        """
        
        ModelConfig.setDefaultModel("llava:7b", False)
        
        # response = runLLM(prompt=prompt)
        
        with open(path, "rb") as imageFile:
            image = base64.b64encode(imageFile.read()).decode("utf-8")
        
        
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{image}"
                            }
                        },
                        {
                            "type": "text",
                            "text": prompt
                        }
                    ]
                }
            ],
            max_tokens=1000
        )

        print(response)
        print()
        print()
        print(response.choices[0].message.content)
        
        try:
            parsedData = json.loads(response.choices[0].message.content)
        except json.JSONDecodeError:
            parsedData = {}


        # return {
        #     'bedrag-voor-btw': 123.45,
        #     'bedrag-na-btw': 150,
        #     'datum': '2025-05-30',
        #     'leverancier': 'Coolblue',
        # }
        return parsedData
    