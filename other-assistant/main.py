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

# Dialogflow library
import dialogflow_v2 as dialogflow
from dialogflow_v2.types import TextInput, QueryInput


#GLOBAL VARIABLE
wikipedia.set_lang('vi')
path = ChromeDriverManager().install()
PROJECT_ID = "canopylab"
SESSION_ID = "mysession"
LANGUAGE_CODE = "en-US"




class Assistant:
    def __init__(self):
        self.language = "vi-VN"
        self.lang = "vi"
        #Dialogflow variable
        self.session_client = dialogflow.SessionsClient()
        self.audio_encoding = dialogflow.enums.AudioEncoding.AUDIO_ENCODING_LINEAR_16
        self.sample_rate_hertz = 16000
        self.session_path =  self.session_client.session_path(PROJECT_ID, SESSION_ID)
      
    def detect_intent_by_texts(self, PROJECT_ID, SESSION_ID, texts, language_code):
        print("SESSION_PATH: {}\n").__format__(self.session_path)

        for text in texts:
            text_input = TextInput(text=text, language_code=language_code)

            query_input = QueryInput(text=text_input)

            response = self.session_client.detect_intent(sesison=session)



    def speak(self, text):
        print("Bot: {}".format(text))
        tts = gTTS(text=text, lang=self.lang, slow=False)
        tts.save("sound.mp3")
        playsound("sound.mp3")

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


if __name__ == "__main__":
    my_assistant = Assistant()
    my_assistant.speak("Xin chào, tôi là E waiter")
    text = my_assistant.get_user_voice()
    my_assistant.stop()



