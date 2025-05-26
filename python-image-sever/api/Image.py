import json

from flask import make_response
from flask_restful import Resource,reqparse
import model.oracledb.image_model as oracle
from flask import jsonify
import werkzeug

import base64

class Image(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('uploads', location='form')
    def get(self,id):
        # print(id)

        # conn = oracle.connectDatabase()
        # data = oracle.select(conn, id)
        # print('get',data[0])

        str1 = 'C:\\Users\\user\\Upload\\' + str(id) + '.png'
        with open(str1, "rb") as f:
            base64_string1 = base64.b64encode(f.read())
        # print(base64_string1)
        return {'image':base64_string1.decode('utf8')}
        # return jsonify(data)  # 테이블 2개여서 성공이면 2이다
    def put(self,id):
        print('>>>',id)
        args = self.parser.parse_args()
        image = args['uploads']
        print('adadsas',image)
        str1 = 'C:\\Users\\user\\Upload\\' + str(id) + '.png'
        with open(str1, "wb") as f:
            f.write(base64.b64decode(image.encode()))
        return '성공'