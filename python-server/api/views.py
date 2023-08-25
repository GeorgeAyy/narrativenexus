import language_tool_python
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

class GrammarCorrectionView(APIView):
    def post(self, request):
        text = request.data.get('text')

        # Perform grammar correction
        language_tool = language_tool_python.LanguageTool('en-US', config={'maxSpellingSuggestions': 1})
        #text = 'A sentence with a error in the Hitchhiker’s Guide tot he Galaxy'
        matches = language_tool.check(text)
        correctText = language_tool.correct(text)

        for mistakes in matches:
            print(mistakes)

        # Return the corrected text in the response
        response_data = {
            'text': text,
            'corrected_text': correctText,
            'matches': matches
        }
        return Response(response_data, status=status.HTTP_200_OK)
