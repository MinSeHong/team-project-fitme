import base64, json

from flask_restful import Resource,reqparse
from flask import jsonify, request
import model.workout.workout_model as oracle

class Workout(Resource):
    def __init__(self):
        # reqparse.RequestParser() 객체를 생성하여 요청에서 파라미터를 파싱하는데 사용
        self.parser = reqparse.RequestParser()
        # 공통 파라미터를 설정합니다. form 데이터에서 'DESCRIPTION', 'MEMO', 'CATEGORY', 'ACCURACY', 'COUNTS', 'WEIGHT', 'END_DATE'를 파싱
        # 아래는 공통 파라미터 설정(key=value로 받기)
        self.parser.add_argument('DESCRIPTION',location='form')
        self.parser.add_argument('MEMO', location='form')
        self.parser.add_argument('CATEGORY', location='form')
        self.parser.add_argument('ACCURACY', location='form')
        self.parser.add_argument('COUNTS', location='form')
        self.parser.add_argument('WEIGHT', location='form')
        self.parser.add_argument('END_DATE', location='form')
    def get(self,user_id):
        # print('Received request:', request.url)
        # action = request.args.get('action')
        # print('action : ',action)
        #
        # if action == 'count':
        #     # 운동 count 데이터를 반환하는 분기
        #     conn = oracle.workout_connectDatabase()
        #     counts = oracle.workout_counts(conn, user_id)
        #     oracle.workout_close(conn)
        #     counts_dict = {row[0]: row[1] for row in counts}
        #     return jsonify(counts_dict)
        # else:

        # 요청에서 파라미터를 파싱
        # args = self.parser.parse_args()

        try:
            # 요청에서 'date' 파라미터를 추출
            dof = request.args.get('date')
            #workout_all=[]
            # 요청에서 'calId' 파라미터를 추출
            cal = request.args.get('calId')

            if(cal != None):
                # 오라클 데이터베이스에 연결
                conn = oracle.workout_connectDatabase()
                # 'calId'에 해당하는 운동 정보를 조회
                str1 = oracle.workout_selectOne(conn,cal)
                # 데이터베이스 연결을 종료
                oracle.workout_close(conn)
                # 조회한 운동 정보을 반환
                return str1

            # 오라클 데이터베이스에 연결
            conn = oracle.workout_connectDatabase()
            # 사용자 ID와 날짜에 해당하는 모든 운동 정보를 조회
            workout_all = oracle.workout_selectAll(conn, user_id, dof)
            # 데이터베이스 연결을 종료
            oracle.workout_close(conn)
            # workDiary를 저장할 리스트를 초기화
            workDiary =[]
            for i in range(len(workout_all)):
                # 운동 정보에 해당하는 이미지 파일의 경로를 생성
                str1 = 'C:\\Users\\user\\Upload\\' + workout_all[i][3] + '.png'
                print('str1에 뭐가 찍히고 있는거지?? : ',str1)
                # 이미지 파일을 열고, base64로 인코딩
                with open(str1, "rb") as f:
                    image = base64.b64encode(f.read())
                    # 운동 정보와 인코딩된 이미지를 workDiary 리스트에 추가
                    workDiary.append(list(workout_all[i])+list(["data:image/png;base64," + str(image)[2:-2]]))

            # 리액트로 보내줄 헤더를 설정
            list_ = ['chart1','workout','chart2','chart3']
            # 임시 데이터를 설정
            lis = ['Red', 'Good', 'Orange', 'Yellow', 'Green', 'Blue']
            num = [10, 15, 3, 5, 7, 2]

            j=[]
            for index in range(len(lis)):
                j.append({'name':lis[index],'size':num[index]})
            # JSON 형식으로 응답을 반환
            return jsonify(dict(zip(list_,(j,workDiary,j,j))))
        except:
            print("error")

    def post(self,user_id):
        # 요청에서 파라미터를 파싱
        args = self.parser.parse_args()
        # 오라클 데이터베이스에 연결
        conn1 = oracle.workout_connectDatabase()
        # 오라클 데이터베이스에 파라미터를 삽입하고, 그 결과를 data에 저장
        data = oracle.workout_insert(conn1, user_id, args)
        return data  # 테이블 2개여서 성공이면 2이다

    def put(self,user_id):
        args = self.parser.parse_args()
        conn = oracle.workout_connectDatabase()
        data = oracle.workout_update(conn, user_id, args)
        oracle.workout_close(conn)
        return data

    def delete(self,user_id):
        conn = oracle.workout_connectDatabase()
        data = oracle.workout_delete(conn,user_id)
        return data