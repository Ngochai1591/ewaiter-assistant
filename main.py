import requests
from flask import Flask, request, abort
from flask_cors import CORS
from en_skill import en_skill
app = Flask(__name__)
CORS(app)

@app.route('/', methods=['POST'])
def main():
    print('[INFO] Receive request')
    print('[INFO] Request info')
    data = request.get_json()['data']
    print(data)
    print("="*20)
    chatbot_lang = data['lang']
    print("CHATBOT_LANG", chatbot_lang)
    print('='*20)
    user_input = data['user_input']
    print('USER_INPUT', user_input)
    print('='*20)
    session_id = data['session_id']
    print('SESSION_ID', session_id)
    print('='*20)
    #Checking bot language
    if chatbot_lang == "en":
        print('[INFO] Change request to EN_SKILL')
        my_assistant = en_skill()
        data = my_assistant.handle_request(session_id, user_input)
        if data:
            return(data, 200)
        else:
            return abort(403)
    else:
        return abort(404)


if __name__ == "__main__":
    app.run(host='0.0.0.0', port = 8080)
