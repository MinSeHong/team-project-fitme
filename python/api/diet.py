from flask_restful import Resource,reqparse
from flask import jsonify , request
import model.diet.diet_model as oracle
import model.image_oracledb.image_model as imagedb
import model.diet.publicData_model as pub

import numpy as np

from datetime import datetime
import base64

class Diet(Resource):
    def __init__(self):
        # reqparse.RequestParser() 객체를 생성하여 요청에서 파라미터를 파싱하는데 사용
        self.parser = reqparse.RequestParser()
        # 공통 파라미터를 설정. form 데이터에서 'DESCRIPTION', 'MEMO', 'DIET_IMAGE', 'FOOD', 'FOOD_WEIGHT', 'END_DATE'를 파싱
        # 아래는 공통 파라미터 설정(key=value로 받기)
        self.parser.add_argument('DESCRIPTION',location='form')
        self.parser.add_argument('MEMO', location='form')
        self.parser.add_argument('DIET_IMAGE', location='form')
        self.parser.add_argument('FOOD', location='form')
        self.parser.add_argument('FOOD_WEIGHT', location='form')
        self.parser.add_argument('END_DATE', location='form')
    def get(self,user_id):
        # 요청에서 파라미터를 파싱
        args = self.parser.parse_args()
        try:
            #겟 파라미터 받아오는 법(http://localhost:5000/diet/3?param1=23)
            dof = request.args.get('date')

            # 식품 정보를 저장할 리스트를 초기화
            food_all=[]
            # 요청에서 'calId' 파라미터를 추출
            cal = request.args.get('calId')
            if(cal != None):
                # 오라클 데이터베이스에 연결
                conn = oracle.diet_connectDatabase()
                # 'calId'에 해당하는 식품 정보를 조회
                str1 = oracle.diet_selectOne(conn, cal)
                # 데이터베이스 연결을 종료
                oracle.diet_close(conn)
                # 라인 함수를 사용하여 식품 정보를 처리
                st = pub.line(str1[3])
                strArr = list(str1)
                strArr.append(list(st[0]))
                print(strArr,'str1')
                # 조회한 식품 정보를 JSON 형식으로 반환
                return jsonify(strArr)

            # 오라클 데이터베이스에 연결
            conn = oracle.diet_connectDatabase()
            # 사용자 ID와 날짜에 해당하는 모든 식품 정보를 조회
            food_all = oracle.diet_selectAll(conn, user_id, dof)
            # 데이터베이스 연결을 종료
            oracle.diet_close(conn)
            print('food_all',food_all)
            # foodDiary를 저장할 리스트를 초기화
            foodDiary = []
            # 조회한 모든 식품 정보에 대해 반복
            for i in range(len(food_all)):
                # 식품 정보의 4번째 요소가 None이거나 'None'이라면 id를 41로 하고, 그렇지 않으면 해당 값을 id로 설정
                id = 41 if food_all[i][4] == None or food_all[i][4] == 'None' else food_all[i][4]
                print('id',id)
                # id에 해당하는 이미지 파일의 경로를 생성
                str1 = 'C:\\Users\\user\\Upload\\' + str(id) + '.png'

                with open(str1, "rb") as f:
                    image = base64.b64encode(f.read())
                    # 식품 정보와 인코딩된 이미지를 foodDiary 리스트에 추가
                    foodDiary.append(list(food_all[i][0:4])+list(["data:image/png;base64,"+str(image)[2:-2]])+list(food_all[i][5:]))
            print('foodDiary',foodDiary)
            # 리액트로 보내줄 헤더를 설정
            list_ = ['chart1','foodDiary','chart2','chart3'] #리액트로 보내줄 헤더

            # 임시 데이터를 설정
            lis = ['asdasdasd', '나이스', 'Yellow', 'Green', 'Purple', 'Orange1']
            num = [12, 19, 3, 5, 2, 3]

            # 공공 데이터를 저장할 리스트를 초기화
            pub_data = []
            arr2 = ['아침','점심','저녁','간식']
            time1=[0,0,0,0]

            # foodDiary에 데이터가 있다면 아래 코드를 실행
            if len(foodDiary) > 0:
                # 식품 정보를 처리하는 코드
                # 생략된 부분은 식품 정보를 pub_data 리스트에 추가하는 코드
                data1 =[0,0,0,0,0,0]
                for i in range(len(foodDiary)):
                    # print('1',foodDiary[i][3])
                    time0 = datetime.strptime(foodDiary[i][3], '%Y-%m-%d %H:%M:%S')
                    hTime = time0.strftime('%H')

                    data = str(foodDiary[i][2])
                    pub_data = pub.line(data)[2:]
                    print('pub_data',pub_data)

                    pub_num=0
                    if pub.line(data)[0][1].find('g') == -1:
                        pub_num = float(pub.line(data)[1][:-2])
                    else:
                        pub_num = float(pub.line(data)[1][:-1])
                    dnum = foodDiary[i][5]/pub_num

                    print("공공데이타 :", pub_data)  # null값 있는지 확인
                    if (int(hTime) >= 5 and int(hTime) <= 9):
                        time1[0] += round((pub_data[0]*dnum)+time1[0],2)
                    elif int(hTime) <= 14 and int(hTime) >= 11:
                        time1[1] += round((pub_data[0]*dnum)+time1[1],2)
                    elif int(hTime) <= 20 and int(hTime) >= 17:
                        time1[2] += round((pub_data[0]*dnum)+time1[2],2)
                    else:
                        time1[3] += round((pub_data[0]*dnum)+time1[3],2)

                    for k in range(len(pub_data)):
                        if(np.isnan(pub_data[k])):
                            print('k',k)
                            pub_data[k] = 0
                        print(k,':',round(pub_data[k]*dnum,2))
                        data1[k] = round(round(pub_data[k]*dnum,2)+data1[k],2)
                    pub_data = data1
                print(time1)
            arr = ('에너지(kcal)', '수분(g)', '단백질(g)', '지방(g)', '회분(g)', '탄수화물(g)')
            j=[]
            chart1 = []
            chart2 = []
            for index in range(len(lis)):
                j.append({'name':lis[index],'size':num[index]})
                # print(len(pub_data))
                if index < len(arr) and len(pub_data) != 0:
                    chart1.append({'name':arr[index],'size':pub_data[index]})
                if index < len(arr2) and len(time1) != 0:
                    chart2.append({'name':arr2[index],'size':time1[index]})

            # JSON 형식으로 응답을 반환
            return jsonify(dict(zip(list_, (j, foodDiary, chart1, chart2))))
        except:
            print("error")

    def post(self,user_id):
        # 요청에서 파라미터를 파싱
        args = self.parser.parse_args()

        # 'DIET_IMAGE'를 파라미터에서 추출
        # imagedb
        image = args['DIET_IMAGE']
        print('image', image == '', image==None)
        # 추출한 이미지가 None이 아니고 비어있지 않다면 아래 코드를 실행
        if image != None and image != '':
            print('image,dase64',image)
            # 이미지 데이터베이스에 연결
            conn = imagedb.connectDatabase()
            # 이미지 데이터베이스에 이미지 데이터를 삽입하고, 그 결과를 data에 저장
            data = imagedb.insert(conn)
            # 이미지 파일의 경로를 생성
            str1 = 'C:\\Users\\user\\Upload\\' + str(data[0]) + '.png'
            # 파라미터의 'DIET_IMAGE'를 삽입한 이미지 데이터의 id로 변경
            args['DIET_IMAGE'] = str(data[0])
            # 이미지 파일을 생성하고, 파라미터에서 받은 이미지 데이터를 디코딩하여 파일에 쓴다.
            with open(str1, "bw") as f:
                f.write(base64.b64decode(image.encode()))
        # 파라미터의 모든 항목을 출력
        for t in args:
            print(t,':',args[t])
        # 오라클 데이터베이스에 연결
        conn1 = oracle.diet_connectDatabase()
        # 오라클 데이터베이스에 파라미터를 삽입하고, 그 결과를 data에 저장
        data = oracle.diet_insert(conn1, user_id, args)
        print('post',data)
        return data #테이블 2개여서 성공이면 2이다



    def put(self,user_id):
        args = self.parser.parse_args()
        # print('args',args)
        conn = oracle.diet_connectDatabase()
        data = oracle.diet_update(conn, user_id,args)
        oracle.diet_close(conn)
        return data

    def delete(self,user_id):
        print('data', user_id)
        conn = oracle.diet_connectDatabase()
        data = oracle.diet_delete(conn, user_id)
        print('data',data)
        return data