'''
python -m pip install --upgrade pip
pip install ultralytics
pip install pillow
pip install opencv-python


'''
from flask_restful import Resource
from flask import request,make_response


import base64
from PIL import Image
import json
import io
import os
from ultralytics import YOLO
import shutil

import pandas as pd

class FoodDetection(Resource):
    def __init__(self):
        self.model = YOLO('food/best.pt')
    def post(self):
        base64Encoded = request.form['base64Encoded']
        image_b64 = base64.b64decode(base64Encoded)
        image_memory = Image.open(io.BytesIO(image_b64))
        image_memory.save('./images/new.jpg')
        results = self.model.predict(['./images/new.jpg'],save=True, save_txt= True)
        try:
            with open(os.path.join(results[0].save_dir, 'labels\\new.txt'),'rb') as f:
                data = f.readlines()
            data1 = pd.read_csv('food/food_yolov8.csv',encoding='utf-8')
            name =(data[0].split()[0]).decode('utf-8').replace('\x08', '')
            foodName = data1[data1['number']==int(name)]['name'].to_string()
            foodName1 = foodName.split()[1]

        except:
            foodName1 = ''
        with open(os.path.join(results[0].save_dir, 'new.jpg'),'rb') as f:
            base64Predicted= base64.b64encode(f.read()).decode('utf-8')
        shutil.rmtree(results[0].save_dir)
        return make_response(json.dumps({'base64':base64Predicted , 'food':foodName1},ensure_ascii=False))
