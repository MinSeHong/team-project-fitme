from flask_restful import Resource
from flask import jsonify, request
import model.diet.publicData_model as pub

class Public(Resource):
    def get(self):
        arr = pub.lineArr()
        print(arr)
        return jsonify(list(arr))
