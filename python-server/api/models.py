from django.db import models

class CorrectedText(models.Model):
    text = models.TextField()
    corrected_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
