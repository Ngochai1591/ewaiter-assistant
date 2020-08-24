import os
from playsound import playsound
import speech_recognition as sr
import time
import sys
import ctypes
import wikipedia
import datetime
import json
import re
import webbrowser
import smtplib
import requests
import urllib
import urllib.request as urllib2
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from webdriver_manager.chrome import ChromeDriverManager
from time import strftime
from gtts import gTTS
from youtube_search import YoutubeSearch
from googletrans import Translator
# Dialogflow library
import dialogflow_v2 as dialogflow
from dialogflow_v2.types import TextInput, QueryInput
from google.protobuf.json_format import MessageToJson


#GLOBAL VARIABLE
wikipedia.set_lang('vi')
path = ChromeDriverManager().install()
PROJECT_ID = "canopylab"
SESSION_ID = "111111"
LANGUAGE_CODE = "en-US"
KEY = "key.json"
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = KEY



class Assistant:
    def __init__(self):
        self.language = "vi-VN"
        self.lang = "vi"
        self.dest_en = "en"
        self.dest_vi = "vi"
        # Dialogflow variable
  
        self.session_client = dialogflow.SessionsClient()

        # self.audio_encoding = dialogflow.enums.AudioEncoding.AUDIO_ENCODING_LINEAR_16
        # self.sample_rate_hertz = 16000
        self.session =  self.session_client.session_path(PROJECT_ID, SESSION_ID)
        
    def detect_intent_by_texts(self, PROJECT_ID, SESSION_ID, text, language_code):
        print("SESSION_PATH: {}\n".format(self.session))

        text_input = TextInput(text=text, language_code=language_code)

        query_input = QueryInput(text=text_input)

        response = self.session_client.detect_intent(session=self.session, query_input=query_input)

        print('=' *20)
        print('Query text: {}'.format(response.query_result.query_text))
        print('Detected intent: {} (confidence: {}) \n'.format(
            response.query_result.intent.display_name,
            response.query_result.intent_detection_confidence
        ))

        # print('TEST: ', response.query_result)
        message_json = json.loads(MessageToJson(response))
        fulfillmentMessages = message_json['queryResult']['fulfillmentMessages']
        if(len(fulfillmentMessages) == 2):
            print("SUGGEST LIST")
            fulfillment_text = fulfillmentMessages[0]['text']['text'][0]
            vietnamese_text = self.translate_from_english_to_vietnamese(fulfillment_text)
            self.speak(vietnamese_text)
            print("Fulfillment text: ", fulfillment_text)
            print("Suggestion: ", fulfillmentMessages[1]['quickReplies']['quickReplies'])
        else:
            print("NORMAL LIST")
            fulfillment_text = fulfillmentMessages[0]['text']['text'][0]
            vietnamese_text = self.translate_from_english_to_vietnamese(fulfillment_text)
            self.speak(vietnamese_text)
            print("Fulfillment text: ", fulfillment_text)

    def speak(self, text):
        print("Bot: {}".format(text))
        tts = gTTS(text=text, lang=self.lang, slow=False)
        tts.save("sound.mp3")
        playsound("sound.mp3")
        os.remove("sound.mp3")

    def stop(self):
        self.speak("Hẹn gặp lại bạn sau !")

    def get_audio(self):
        r = sr.Recognizer()
        with sr.Microphone() as source:
            print("User input: ", end="")
            audio = r.listen(source, phrase_time_limit=5)
            try:
                text = r.recognize_google(audio, language=self.language)
                print(text)
                return text
            except:
                print("....")
                return 0

    def get_user_voice(self):
        for i in range(3):
            text = self.get_audio()
            if text:
                return text.lower()
            elif i < 2:
                self.speak("Bot không nghe rõ, bạn nói lại được không?")
        time.sleep(1)
        self.stop()
        return 0

    def translate_from_vietnamese_to_english(self, text):
        translator = Translator()
        text_translator = translator.translate(text, dest=self.dest_en)
        translated_text = text_translator.text
        return translated_text

    def translate_from_english_to_vietnamese(self, text):
        translator = Translator()
        text_translator = translator.translate(text, dest=self.dest_vi)
        translated_text = text_translator.text
        return translated_text



if __name__ == "__main__":
    my_assistant = Assistant()
    # my_assistant.speak("Xin chào, tôi là E waiter")
    # text = my_assistant.get_user_voice()
    # my_assistant.stop()

    # user_input = "Xin chào"
    # user_input = "Tôi tên là Hải"
    # user_input = "Bạn có thể  đặt giúp tôi 1 ly cà phê và 2 ly trà sữa được không ?"
    # user_input = "vâng"
    # user_input = "không phải"
    while(True):
        user_input = input("user_input: ")
        if user_input != "tạm biệt":
            translated_text = my_assistant.translate_from_vietnamese_to_english(user_input)
            print("TRANSLATE_TEXT: ", translated_text)
            my_assistant.detect_intent_by_texts(PROJECT_ID, SESSION_ID, translated_text, LANGUAGE_CODE)
        else:
            break



