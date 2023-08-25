from django.db import models

# Create your models here.
class CorrectedText(models.Model):
    text = models.TextField()
    corrected_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)