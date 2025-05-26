import os
import openai
from openai import OpenAI
from flask_restful import Resource,reqparse
from flask import jsonify, request
from flask import make_response

client = OpenAI(
    # 환경변수 api키
    api_key=os.environ.get("OPENAI_API_KEY"),
)

class Chatbot(Resource):

    def post(self):
        messages = [{"role":"assistant","content":
        """
        You are 'Fitme' customer service chatbot. 
        This platform is designed to provide personalized digital healthcare services to assist individuals with their health needs. 
        In addition to offering personalized diet plans, cooking methods, and food recommendations tailored to individual health, 
        detailed recommendations for exercises beneficial to health can also be provided. 
        The more tailored the health information is to the individual's characteristics, the better. 
        When responding, it is important to be polite and courteous to all users. 
        If there is a question for which a clear answer is not available, please respond with 'Please contact the administrator.' 
        Since you are a Korean bot and the majority of users are Korean, please respond in Korean.
        """}]
        while True:
            # 메세지 받기
            content = request.json['message']
            print('받은 메세지:', content)
            # AI 챗봇에 메시지를 전달하고, 챗봇의 응답을 받아옴
            response = chatbot(content, messages=messages)
            print('받은 응답메세지', response)
            messages = response['messages']
            if response['status'] == 'SUCCESS':
                answer = response['messages'][len(messages) - 1]['content']
                print(f'챗봇:{answer}')
                return jsonify({"answer": answer})
            else:
                print(messages)

def chatbot(content,model='gpt-3.5-turbo',messages=[],temperature=1):
    error = None
    try:
        #사용자 메시지 리스트 append
        messages.append({'role': 'user', 'content': content})
        #메시지 gpt api로 챗봇한테 전달
        response = client.chat.completions.create(model=model, messages=messages)
        #챗봇 응답 추가
        answer = response.choices[0].message.content
        messages.append({'role': 'assistant', 'content': answer})
        #응답 결과 반환
        return {'status': 'SUCCESS', 'messages': messages}

    except openai.error.APIError as e:
        # Handle API error here, e.g. retry or log
        print(f"OpenAI API returned an API Error: {e}")
        error = e
    except openai.error.APIConnectionError as e:
        # Handle connection error here
        print(f"Failed to connect to OpenAI API: {e}")
        error = e
    except openai.error.InvalidRequestError as e:
        print(f"Invalid Request to OpenAI API: {e}")
        error = e
    except openai.error.RateLimitError as e:
        # Handle rate limit error (we recommend using exponential backoff)
        print(f"OpenAI API request exceeded rate limit: {e}")
        error = e
    return {'status': 'FAIL', 'messages': error}
