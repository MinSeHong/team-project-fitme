import json

from flask import make_response
from flask_restful import Resource,reqparse
import model.oracledb.image_model as imagedb
import base64
import werkzeug

import os
#파일 업로드
#https://flask-restful.readthedocs.io/en/latest/reqparse.html?highlight=add_argument#argument-locations

class ImageList(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('uploads', location='form', action='append')

    def post(self):
        args = self.parser.parse_args()
        images = args['uploads']
        # print(images)
        num = []
        for image in images:
            try:
                if image != None and image != '':
                    # print('image,dase64', image)
                    conn = imagedb.connectDatabase()
                    data = imagedb.insert(conn)
                    num.append(data[0])
                    str1 = 'C:\\Users\\user\\Upload\\' + str(data[0]) + '.png'
                    args['DIET_IMAGE'] = str(data[0])
                    with open(str1, "bw") as f:
                        f.write(base64.b64decode(image.encode()))

            except:
                return make_response(json.dumps({'failure':'최대 파일 업로드 용량 초과'},ensure_ascii=False),413)
        return num
        # return make_response(json.dumps(args,ensure_ascii=False), 200)
