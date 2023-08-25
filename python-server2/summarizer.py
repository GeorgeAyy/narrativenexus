# Add OpenAI import
import openai
from flask import Flask, request, jsonify
from flask_cors import CORS
import json

with open('./server/config.json') as config_file:
    config_data = json.load(config_file)

app = Flask(__name__)
CORS(app, resources={r"/process_text": {"origins": "http://localhost:3000"}}, allow_headers=["Content-Type"])
# Set OpenAI configuration settings
openai.api_type = "azure"
openai.api_base = "https://narrativenexus.openai.azure.com/"
openai.api_version = "2023-03-15-preview"
openai.api_key = config_data['apikey']

@app.route('/process_text', methods=['POST'])
def process_text():
    data = request.get_json()
    text = data['text']
    action = data['action']
    print("Action: " + text)
    if action == 'summarize':
        response = summarize_text(text)
    elif action == 'paraphrase':
        response = paraphrase_text(text)
    else:
        response = {'error': 'Invalid action'}

    return jsonify(response)


def summarize_text(text):
    # You can set the max tokens to control the length of the summary
    response = openai.ChatCompletion.create(
        engine="narrativedeployment",
        temperature=0, # You can set the temperature to control the randomness of the summary
        max_tokens=150,
        messages= [
                {"role":"system", "content":"Summarize the following text without adding extra words of your own."},
                {"role":"user","content": text}
        ],
        
    )
    return (response.choices[0].message.content + "\n")


def paraphrase_text(text):
    # You can set the max tokens to control the length of the paraphrase
    response = openai.ChatCompletion.create(
        engine="narrativedeployment",
        temperature=0, # You can set the temperature to control the randomness of the paraphrase
        max_tokens=100,
        messages= [
                {"role":"system", "content":"You are a helpful assistant. Paraphrase the following text."},
                {"role":"user","content": text}
        ]
    )
    return response.choices[0].message.content + "\n"
    

if __name__ == '__main__':
    
    print("Starting the app on port 5000...")
    
    app.run(host='0.0.0.0', port=5000, debug=True)