from flask_restful import Resource
from flask import make_response,jsonify
from model.crawling.chiken_shoppingmall_crawling import shop
import os
import json

class CrawlingShop(Resource):
    def get(self):
        json_path = f'{os.path.join(os.path.dirname(__file__), "../model/crawling/shop.json")}'
        line = []
        with open(json_path, 'r', encoding='utf8') as f:
            return make_response(json.load(f))