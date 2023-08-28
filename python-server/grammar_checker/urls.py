from django.urls import path
from api.views import GrammarCorrectionView
from api import views
urlpatterns = [
    path('api/grammar-correction/', GrammarCorrectionView.as_view(),
         name='grammar_correction'),
    path('api/process_text/', views.process_text, name='process_text'),
    path('api/generate_prompt/', views.generate_prompt, name='generate_prompt'),
    path('api/autocomplete/',views.autocomplete, name='autocomplete')
]
