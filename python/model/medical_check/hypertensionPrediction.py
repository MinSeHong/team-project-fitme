from flask_restful import Resource
from flask import request, jsonify
import joblib
import numpy as np

class HypertensionPrediction(Resource):
    def __init__(self):
        # 모델 로드 시 변수명 수정 (loaded_model -> self.model)
        self.model = joblib.load('model/medical_check/modelHigh.joblib')

    def get(self):
        input_features = [
            request.args.get('age', type=int),
            request.args.get('sex', type=int),
            request.args.get('cp', type=int),
            request.args.get('trestbps', type=int),
            request.args.get('chol', type=int),
            request.args.get('fbs', type=int),
            request.args.get('restecg', type=int),
            request.args.get('thalach', type=int),
            request.args.get('exang', type=int),
            request.args.get('oldpeak', type=float),
            request.args.get('slope', type=int),
            request.args.get('ca', type=int),
            request.args.get('thal', type=int),
        ]

        input_array = np.array([input_features])
        proba = self.model.predict_proba(input_array)
        print('고혈압 잘 들어옴')
        # 결과 반환
        result = {
            "no_hypertension_proba": round(proba[:, 1][0] * 100, 1),
            "hypertension_proba": round(proba[:, 0][0] * 100, 1)
        }
        return jsonify(result)

