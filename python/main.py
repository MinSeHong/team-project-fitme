#https://flask.palletsprojects.com/en/3.0.x/deploying/asgi/
#pip install hypercorn #파이썬 기반 ASGI서버(파이썬 3.6이상부터 지원)
#pip install asgiref  #플라스크 앱을 Wsgi로 변환용
#pip install uvicorn  #파이썬 기반 ASGI서버(파이썬 3.7이상부터 지원)
'''
아래는 둘다 파이썬 웹 어플리케이션(Flask App)과 웹 서버 간의 공통적인 인터페이스를 정의한
프토 토콜이다
CGI(Common Gateway Interface)방식은 요청 수만큼 서버에 프로세스가 실행되지만
아래 두 프로토콜은 하나만 실행된다
WSGI(Web Server Gateway Interface):  동기 요청 처리 방식.웹 소켓 미 지원
ASGI(Asynchronus Server Gateway Interface): 비동기 여ㅛ청 처리 방식. 웹소켓 지원
여러 요청 처리시에는 ASGI가 성능이 우수하다
ASGI은 WSGI의 상위 버전이다
'''
from app import app #플라스크 어플리케이션
from asgiref.wsgi import WsgiToAsgi
import uvicorn


asgi_app = WsgiToAsgi(app)#플라스크 앱을 ASGI와 호환되는 WSGI 앱으로 변환

if __name__ == '__main__':
    uvicorn.run(asgi_app,host='0.0.0.0',port=5000)

#hypercorn 명령어로 실행시(옵션은 아래 사이트)
#https://hypercorn.readthedocs.io/en/latest/how_to_guides/configuring.html
#혹은
#hypercorn --help
#hypercorn main:asgi_app --reload --bind 0.0.0.0:8989

#스크립트파일 실행시
#(FlaskServer) PS E:\CCH\Workspace\Python\FlaskServer>python main.py
#uvicorn.run(asgi_app,host='0.0.0.0',port=8989) 즉 uvocorn서버로 실행된다
