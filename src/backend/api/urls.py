from django.urls import path
from . import views

urlpatterns = [
    path('getFacturen/', views.GetFacturen.as_view()),
    path("addFactuur/", views.AddFactuur.as_view()),
]
