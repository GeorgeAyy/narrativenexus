import language_tool_python
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.conf import settings
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import openai
import json


with open('./server/config.json') as config_file:
    config_data = json.load(config_file)

openai.api_type = "azure"
openai.api_base = "https://narrativenexus.openai.azure.com/"
openai.api_version = "2023-03-15-preview"
openai.api_key = config_data['apikey']


class GrammarCorrectionView(APIView):
    def post(self, request):
        text = request.data.get('text')

        # Perform grammar correction
        language_tool = language_tool_python.LanguageTool(
            'en-US', config={'maxSpellingSuggestions': 1})
        # text = 'A sentence with a error in the Hitchhiker’s Guide tot he Galaxy'
        matches = language_tool.check(text)
        correctText = language_tool.correct(text)

        # Print out the values of variables
        print(f'text: {text}')
        print(f'matches: {matches}')
        print(f'correctText: {correctText}')

        # Return the corrected text in the response
        response_data = {
            'text': text,
            'corrected_text': correctText,
            'matches': matches
        }
        return Response(response_data, status=status.HTTP_200_OK)


@csrf_exempt
def process_text(request):
    """
    Process the text using the OpenAI API.
    """
    data = json.loads(request.body)
    text = data['text']
    action = data['action']

    # Print out the values of variables
    print(f'text: {text}')
    print(f'action: {action}')

    if action == 'summarize':
        response = summarize_text(text)
    elif action == 'paraphrase':
        response = paraphrase_text(text)
    else:
        response = {'error': 'Invalid action'}

    return HttpResponse(json.dumps(response))


def summarize_text(text):
    # You can set the max tokens to control the length of the summary
    response = openai.ChatCompletion.create(
        engine="narrativedeployment",
        temperature=0,  # You can set the temperature to control the randomness of the summary
        max_tokens=150,
        messages=[
            {"role": "system", "content": "Summarize the following text without adding extra words of your own."},
            {"role": "user", "content": text}
        ],

    )
    return (response.choices[0].message.content + "\n")


def paraphrase_text(text):
    # You can set the max tokens to control the length of the paraphrase
    response = openai.ChatCompletion.create(
        engine="narrativedeployment",
        temperature=0,  # You can set the temperature to control the randomness of the paraphrase
        max_tokens=100,
        messages=[
            {"role": "system", "content": "You are a helpful assistant. Paraphrase the following text."},
            {"role": "user", "content": text}
        ]
    )
    return response.choices[0].message.content + "\n"


@csrf_exempt
def generate_prompt(request):

    data = json.loads(request.body)
    text = data['promptText']
    print(f'text: {text}')
    response = openai.ChatCompletion.create(
        engine="narrativedeployment",
        temperature=1,  # You can set the temperature to control the randomness of the story
        max_tokens=300,
        messages=[
            {"role": "system", "content": "write main plot points and ideas to break writers block. about this topic"},
            {"role": "user", "content": text}

        ],


    )
    return HttpResponse(json.dumps(response.choices[0].message.content + "\n"))
