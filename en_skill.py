from ibm_watson import AssistantV2
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
from ibm_watson import ApiException
import json

API_KEY = "kpZT8Byd2eaSZF245jz1Rtv8rfyCTB2o-jvqD3DZCX-E"
VERSION = "2020-09-24"
URL = "https://api.us-south.assistant.watson.cloud.ibm.com/instances/7010a112-1809-49b7-aec6-04b7714c40eb"
ASSISTANT_ID = "8492efb0-8af3-4080-b6c0-7beb5bb17d04"

class en_skill:
    def start_chat(self):
        data = {}
        try:
            #Config authentication for watson assistance
            authenticator = IAMAuthenticator(apikey=API_KEY)
            assistant = AssistantV2(
                version=VERSION,
                authenticator=authenticator
            )
            assistant.set_service_url(URL)
            assistant.set_disable_ssl_verification(True)
            #create session
            session_id = assistant.create_session(assistant_id=ASSISTANT_ID).get_result()['session_id']

            # Initialize with empty value to start the conversation.
            message_input = {
                'message_type:': 'text',
                'text': ''
            }
            #Send message to IBM Watson Assitant
            response = assistant.message(
                ASSISTANT_ID,
                session_id,
                input = message_input
            ).get_result()
            print('='*20)
            print('RESPONSE')
            print(json.dumps(response, indent=4))
            print('='*20)
            
            #get text_reponse
            text_response = ''
            if response['output']['generic']:
                if response['output']['generic'][0]['response_type'] == 'text':
                    text_response = response['output']['generic'][0]['text']
            

            if text_response:
                data = {
                    'text_response': text_response,
                    'session_id': session_id
                }
            return data
        except ApiException as ex:
            print('ERROR: ', ex.message, "CODE: ", ex.code )
            return data

    def continue_chat(self, session_id, user_input):
        data = {}
        try:
            #Config authentication for watson assistance
            authenticator = IAMAuthenticator(apikey=API_KEY)
            assistant = AssistantV2(
                version=VERSION,
                authenticator=authenticator
            )
            assistant.set_service_url(URL)
            assistant.set_disable_ssl_verification(True)

            message_input = {
                'message_type:': 'text',
                'text': user_input
            }

            response = assistant.message(
                ASSISTANT_ID,
                session_id,
                input= message_input
            ).get_result()

            print('='*20)
            print('RESPONSE')
            print(json.dumps(response, indent=4))
            print('='*20)
            
            #get text_reponse
            text_response = ''
            if response['output']['generic']:
                if response['output']['generic'][0]['response_type'] == 'text':
                    text_response = response['output']['generic'][0]['text']
            

            if text_response:
                data = {
                    'text_response': text_response,
                    'session_id': session_id
                }
            return data

            
        except ApiException as ex:
            print('ERROR: ', ex.message, "CODE: ", ex.code )
            return data

    def handle_request(self, session_id, user_input):
        if session_id:
            data = self.continue_chat(session_id, user_input)
        else:
            data = self.start_chat()
        
        return data