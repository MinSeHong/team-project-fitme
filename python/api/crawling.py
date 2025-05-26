from flask_restful import Resource
from flask import make_response,jsonify
from model.crawling.google_crawling import google_crawling
from model.crawling.naver_blog_crawling import naver_crawling
from model.crawling.crawling_recipe import recipe
import os
import json

class Crawling(Resource):
    def get(self):
        # print(recipe('중식'))
        json_path = f'{os.path.join(os.path.dirname(__file__), "../model/crawling/food.json")}'
        # print('driver_path',json_path)
        line = []
        with open(json_path, 'r', encoding='utf8') as f:
            return make_response(json.load(f))

        # print('line',line)

        # return jsonify(line)
        # pass
#         articles=naver_news_it()
#         #print(articles)#[((제목,링크주소),이미지URL,요약,신문사),(),(),....]
#         news_dict=[]
#         for titles,imageUrl,summary,_ in articles:#구조분해해서 변수에 저장
#             title,link = titles#구조 분해
#             news_dict.append({'title':title,'link':link,'imageUrl':imageUrl,'summary':summary})
#
#         #print(news_dict)
#         return make_response(json.dumps(news_dict,ensure_ascii=False))