from flask import request
from flask_restful import Resource,reqparse
import cv2 # OpenCV 라이브러리, 이미지 처리에 사용
import numpy as np
from google.cloud import vision # Google Cloud Vision API 사용
import re,logging
from PIL import Image # 이미지 파일을 처리하기 위한 라이브러리
import model.public.inbodyModel as oracle

accountNo = 81
# 스케일링 요소 설정
scale_factor = 2
# 이미지 전처리 및 자르기 위한 섹션 비율 설정
section_ratio = (0.0, 0.1, 0.7, 0.5)

class Ocr(Resource):
    def __init__(self):
        # reqparse.RequestParser() 객체를 생성하여 요청에서 파라미터를 파싱하는데 사용
        self.parser = reqparse.RequestParser()
        # 공통 파라미터를 설정합니다. form 데이터에서 'SKELETAL_MUSCLE', 'BODY_FAT_MASS', 'BODY_FAT_PERCENTAGE', 'BMI', 'WEIGHT'를 파싱
        # 아래는 공통 파라미터 설정(key=value로 받기)
        # self.parser.add_argument('accountNo', location='form')
        self.parser.add_argument('SKELETAL_MUSCLE',location='form')
        self.parser.add_argument('BODY_FAT_MASS', location='form')
        self.parser.add_argument('BODY_FAT_PERCENTAGE', location='form')
        self.parser.add_argument('BMI', location='form')
        self.parser.add_argument('WEIGHT', location='form')

    def get(self,accountNo):
        # date = request.args.get('date')
        # if (date != None):
        #     # 오라클 데이터베이스에 연결
        #     conn = oracle.connectDatabase()
        #     # 'date'에 해당하는 인바디 정보를 조회
        #     inbody_date = oracle.inbody_select(conn, accountNo, date)
        #     # 데이터베이스 연결을 종료
        #     oracle.close(conn)
        pass
    def post(self):
        # args = self.parser.parse_args()
        # 클라이언트로부터 전송받은 이미지 파일 접근
        image_file = request.files.get('file')
        # accountNo = 81
        print('image_file:',image_file)
        print('accountNo:', accountNo)

        if image_file:
            logging.info('Received file: %s', image_file.filename)
            logging.info('File contents: %s', image_file.read())

            image_file.seek(0)  # 파일 읽기 위치를 처음으로 이동
            image = Image.open(image_file.stream) # PIL 라이브러리로 이미지 파일 열기
            image_np = np.array(image) # 이미지를 numpy 배열로 변환

            # 이미지 전처리
            processed_image = make_scan_image(image_np, section_ratio, scale_factor)

            # OCR 수행 함수 호출
            texts = detect_inbody(processed_image)

            pattern = r'^\d*\.\d+$' # 소수점을 포함한 숫자를 찾기 위한 정규 표현식
            matched_texts = []
            for text in texts:
                # 텍스트가 정규 표현식과 일치하는지 확인
                if re.fullmatch(pattern, text):
                    # 실수로 변환
                    num = float(text)
                    # 100 이상이면 100을 빼고 저장
                    if num >= 140:
                        num -= 100
                    # 소수점 두 번째 자리에서 반올림
                    num = round(num, 2)
                    matched_texts.append(num)
            print('matched_texts = ',matched_texts)
            # 데이터베이스 연결
            conn = oracle.connectDatabase()
            inbody_ocr = oracle.inbody_insert(conn, accountNo, matched_texts)
            oracle.close(conn)
            print('inbody_ocr = ', inbody_ocr)

            return matched_texts  # OCR 결과 조건에 맞는 텍스트를 반환

# 이미지 전처리 함수
def preprocess_image(image, scale_factor):
    # 흑백 이미지로 변환
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    # 노이즈 제거
    denoised_image = cv2.fastNlMeansDenoising(gray_image, None, 10, 7, 21)
    # 이미지 스케일링
    resized_image = cv2.resize(denoised_image, None, fx=scale_factor, fy=scale_factor, interpolation=cv2.INTER_CUBIC)

    return resized_image


def make_scan_image(image, section_ratio, scale_factor):
    # 이미지 전처리
    image = preprocess_image(image, scale_factor)

    # 이미지 자르기
    h, w = image.shape[:2]
    x, y, rw, rh = section_ratio
    section = (int(w * x), int(h * y), int(w * rw), int(h * rh))
    cropped = image[section[1]:section[1] + section[3], section[0]:section[0] + section[2]]

    return cropped

# Google Cloud Vision API를 사용하여 이미지에서 텍스트 추출
def detect_inbody(image):
    client = vision.ImageAnnotatorClient()
    # OpenCV 이미지를 임시 파일로 저장
    cv2.imwrite('temp.png', image)
    with open('temp.png', "rb") as image_file:
        content = image_file.read()
    image = vision.Image(content=content)
    response = client.text_detection(image=image, image_context={"language_hints": ["ko"]})
    texts = response.text_annotations

    filtered_texts = []
    for text in texts:
        '''
        print(f'\n"{text.description}"')
        vertices = [
            f"({vertex.x},{vertex.y})" for vertex in text.bounding_poly.vertices
        ]
        print("좌표: {}".format(",".join(vertices)))
        '''
        vertices = [(vertex.x, vertex.y) for vertex in text.bounding_poly.vertices]
        # print('vertices:',vertices)
        # 텍스트 블록의 너비와 높이를 기준으로 필터링 조건 설정
        width = max(vertices, key=lambda x: x[0])[0] - min(vertices, key=lambda x: x[0])[0]
        height = max(vertices, key=lambda x: x[1])[1] - min(vertices, key=lambda x: x[1])[1]

        # 텍스트 블록의 너비와 높이를 기준으로 필터링
        '''
        if (150 <= vertices[0][0] <= 250) and (100 <= vertices[0][1] <= 340):
            filtered_texts.append((text.description, vertices[0][1]))
            print(f'\n"{text.description}"')
            print("좌표: {}".format(",".join(map(str, vertices))))
        '''
        # 필터링 조건에 맞는 텍스트만 선택
        if (250 <= vertices[0][0] <= 600) and (450 <= vertices[0][1] <= 700) and (30 < width and 10 < height):
            filtered_texts.append((text.description, vertices[0][1]))
            # print(f'\n"{text.description}"')
            # print("좌표: {}".format(",".join(map(str, vertices))))
        if (250 <= vertices[0][0] <= 600) and (700 <= vertices[0][1] <= 1150) and (30 < width and 10 < height):
            filtered_texts.append((text.description, vertices[0][1]))
            # print(f'\n"{text.description}"')
            # print("좌표: {}".format(",".join(map(str, vertices))))


    # y 좌표가 낮은 순으로 정렬
    filtered_texts = sorted(filtered_texts, key=lambda x: x[1])
    # y 좌표 정보를 제거하고 텍스트만 남김
    filtered_texts = [text for text, _ in filtered_texts]
    if response.error.message:
        raise Exception(
            "{}\nFor more info on error messages, check: "
            "https://cloud.google.com/apis/design/errors".format(response.error.message)
        )
    return filtered_texts  # 필터링된 텍스트 반환