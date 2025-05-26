from flask import request, jsonify
from flask_restful import Resource
from keras.models import load_model
import numpy as np


class PredictDiabetes(Resource):
    print('당뇨 잘 들어옴')
    def __init__(self):

        # 모델 로드
        self.model = load_model('model/medical_check/my.h5')


    def get(self):
        age = request.args.get('age', type=int)

        # BMI 계산 로직
        user_weight = request.args.get('weight', type=int)
        user_height = request.args.get('height', type=int)
        bmi = user_weight / ((user_height * 0.01) ** 2)
        print(bmi)

        # 각 항목별 선택값 받기
        pregnancies_option = request.args.get('pregnancies', type=int)  # 임신 경험 여부
        glucose_option = request.args.get('glucose', type=int)  # 공복 혈당
        blood_pressure_option = request.args.get('bloodPressure', type=int)  # 혈압
        skin_thickness_option = request.args.get('skinThickness', type=int)  # 피부 두께
        insulin_option = request.args.get('insulin', type=int)  # 인슐린 수치
        diabetes_pedigree_function_option = request.args.get('diabetesPedigreeFunction', type=int)  # 당뇨 가족력

        print(
            f"받은 데이터: 나이 {age}, 임신 전적 {pregnancies_option}, 공복 혈당 {glucose_option}, 혈압 {blood_pressure_option}, 피부 두께 {skin_thickness_option}, "
            f"인슐린 수치 {insulin_option}, 당뇨병 가족력 {diabetes_pedigree_function_option}, 체중 {user_weight}, 키 {user_height}, 계산된 BMI {bmi:.2f}")
        # 선택에 따른 값 설정
        pregnancies = 0 if pregnancies_option == 1 else 2
        glucose = 100 if glucose_option == 1 else 150
        blood_pressure = 100 if blood_pressure_option == 1 else 80
        skin_thickness = 30 if skin_thickness_option == 1 else 20
        insulin = 150 if insulin_option == 1 else 200
        diabetes_pedigree_function = 0.5 if diabetes_pedigree_function_option == 1 else 2

        # 모델 입력 데이터 구성
        patient_data = np.array([[pregnancies, glucose, blood_pressure, skin_thickness, insulin, bmi, diabetes_pedigree_function, age]])

        # 모델로 예측 당뇨병 발병 확률 반환
        prediction = self.model.predict(patient_data) * 100
        # prediction_rounded = np.round(prediction, 1).tolist()
        prediction_rounded = [round(pred, 1) for pred in prediction[0].tolist()]
        # 랜덤식단 선택
        # meals = self.diabetes_meals()

        # 예측결과와 식단 정보를 JSON형태로 클라이언트에 응답.
        return jsonify({'prediction': prediction_rounded})