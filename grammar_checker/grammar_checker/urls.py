from django.urls import path
from api.views import GrammarCorrectionView
urlpatterns = [
    path('api/grammar-correction/', GrammarCorrectionView.as_view(), name='grammar_correction'),
]
