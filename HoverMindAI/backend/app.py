from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import openai
import os

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

# Get OpenAI API key from environment variable
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
if not OPENAI_API_KEY:
    raise ValueError("No OpenAI API key found. Please set OPENAI_API_KEY environment variable.")

client = openai.OpenAI(api_key=OPENAI_API_KEY)

system_message = (
    "You are a smart robotic web assistant. "
    "When the user asks for a change to the website, "
    "always respond with a valid JSON object with the following format: "
    "{\"action\": \"modify_dom\", \"selector\": \"...\", \"properties\": { ... }}. "
    "For example, to change the background color of the page to black, respond with: "
    "{\"action\": \"modify_dom\", \"selector\": \"body\", \"properties\": {\"style\": {\"backgroundColor\": \"black\"}}}. "
    "If the request is not related to DOM or you can't perform it, respond with a JSON: "
    "{\"action\": \"text_response\", \"message\": \"...\"}. "
    "Do not explain, just return the JSON."
)

@app.route('/api/ai', methods=['POST'])
def ai_chat():
    data = request.json
    user_message = data.get('message', '')
    context = data.get('context', '')
    prompt = f"User: {user_message}\nContext: {context}\n"
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": prompt}
            ]
        )
        answer = response.choices[0].message.content.strip()
        print(answer)
        return jsonify({'answer': answer})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/test-script', methods=['POST'])
def test_script():
    data = request.json
    element_description = data.get('element', '')
    test_type = data.get('type', 'auto')
    prompt = f"Write a {'automated' if test_type == 'auto' else 'manual'} test script for the following element: {element_description}"
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a software testing expert."},
                {"role": "user", "content": prompt}
            ]
        )
        script = response.choices[0].message.content.strip()
        return jsonify({'script': script})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True) 