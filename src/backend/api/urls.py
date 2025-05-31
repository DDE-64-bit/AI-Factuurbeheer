from django.urls import path
from . import views

urlpatterns = [
    path('getFacturen/', views.GetFacturen.as_view()),
    path('upload/', views.UploadImage.as_view()),
    path("delete/", views.VerwijderFacturen.as_view()),
]
