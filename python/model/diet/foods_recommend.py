# https://surpriselib.com/
# pip install scikit-surprise
# pip install cx_Oracle
from surprise import SVD
from surprise import Dataset, Reader
from surprise import accuracy
from surprise.model_selection import train_test_split
import pandas as pd
import csv
import cx_Oracle

from model.diet import publicData_model

class RecommendAlgorithm:
    '''
    rating_scale : (최저평점,최고평점) 예:1부터 5까지 별점을 주는 경우 (1,5)
    itemColumn : itemCsv파일 혹은 데이타 프레임의 헤더명(컬럼명).타입은 list
    ratingColumn : ratingCsv파일 혹은 데이타 프레임 헤더명(컬럼명).타입은 list. 디폴트는 ['userId','itemId','rating']
    '''
    def __init__(self, rating_scale,itemColumn, ratingColumn=['userId', 'itemId', 'rating']):
        #방법1)CSV파일 사용시
        #ratings, items = self.dbconnect('ratings.csv','items.csv')
        #방법2)데이타 프레임 사용시
        ratings,items=self.dbconnect()

        #방법1) CSV파일을 데이타 셋으로 사용시
        '''
        self.reader = Reader(line_format='user item rating', sep=',', rating_scale=rating_scale)
        data = Dataset.load_from_file(ratings, reader=self.reader)
        self.ratings = pd.read_csv(ratings, names=ratingColumn)
        self.items = pd.read_csv(items, names=itemColumn)
        '''

        #https://surprise.readthedocs.io/en/stable/getting_started.html  # load-from-df-example
        #방법2)데이타 프레임을 데이타 셋으로 사용시
        self.reader = Reader(rating_scale=rating_scale)
        data = Dataset.load_from_df(ratings, self.reader)
        self.items = items[itemColumn]
        self.ratings = ratings[ratingColumn]

        #데이타셋을 학습용/평가용으로 분리
        self.train=None
        self.test=None
        self.train, self.test = train_test_split(data, test_size=0.1,shuffle=False)
        self.model = None

    '''
    csv파일 사용시
    args[0]:평점 데이타 csv파일명
    args[1]:아이템 데이타 csv파일명
    데이타 프레임 사용시 전달하지 않는다
    '''
    def dbconnect(self,*args):
        # 2.데이타베이스 연결
        with cx_Oracle.connect(user='FITME', password='FITME', dsn='192.168.0.53:1521/XEPDB1', encoding="UTF-8") as conn:
            print(f'value:{conn},type:{type(conn)}')

            # 3.쿼리 실행을 위한 커서객체 얻기
            cursor = conn.cursor()
            # 4.쿼리 실행
            cursor.execute('SELECT account_no,FOOD,count(food) rating FROM diet d, calendar c WHERE d.calendar_no = c.calendar_no GROUP BY food,account_no ORDER BY rating')
            # 5.패치
            ratings = cursor.fetchall()
            # cursor.execute('SELECT * FROM foods')
            # # 5.패치
            # foods = cursor.fetchall()
            #방법1)CSV파일 사용시(프로젝트 루트에 CSV 파일이 생성됨)
            #self.makeCSV(ratings,args[0])
            #print('[ratings]\n', ratings)
            #self.makeCSV(foods, args[1])
            #print('[foods]\n', foods)


            #방법2)데이타 프레임 사용시
            #userId,itemId,rating 평점 데이타 프레임

            ratings_df = pd.DataFrame({
                "userId": [rating[0] for rating in ratings],
                "itemId": [rating[1] for rating in ratings],
                "rating": [rating[2] for rating in ratings],
            })
            #첫번째 컬럼은 반드시 itemId인 아이템 데이타 프레임
            # items_df = pd.DataFrame({
            #     "itemId": [item[0] for item in foods],
            #     "food": [item[1] for item in foods],
            # })

            # print(publicData_model.lineArr().shape)
            items_df = pd.DataFrame(publicData_model.lineArr(),columns=['itemId'])

            cursor.close()
            #방법1)CSV파일 사용시
            #return args[0], args[1]
            #방법2)데이터 프레임 사용시
            return ratings_df,items_df
    #csv파일 사용시
    def makeCSV(self,items,path):
        with open(path, 'w', encoding='utf8', newline='') as f:
            writer = csv.writer(f)
            # 행의 갯수 만큼 writerow()호출
            writer.writerows(items)

    def calculate_health_score(nutrient_intake, recommended_intake):
        total_score = 0

        for nutrient, intake in nutrient_intake.items():
            recommended = recommended_intake.get(nutrient, 0)  # 해당 영양소의 추천 섭취량을 찾고, 없으면 기본값으로 0 사용
            if recommended == 0:
                continue  # 추천 섭취량이 없으면 건너뜁니다

            ratio = min(intake / recommended, 1.0)  # 비율을 1.0으로 제한합니다
            nutrient_score = ratio * 100  # 점수 계산을 위해 비율을 100으로 스케일링합니다
            total_score += nutrient_score

        return total_score

    # 모델 생성부터 평가까지 시작
    # 모델 생성
    def createModel(self):
        self.model = SVD()


    # 훈련
    def fit(self):
        self.model.fit(self.train)

    # 예측
    def predict(self) -> object: return self.model.test(self.test)

    # 평가
    def evaluate(self, predictions):
        print('모델의 정확도:', end='')
        accuracy.rmse(predictions)

    # 모델 생성부터 평가까지 끝

    # 위의 4개의 메소드를 한번에 실행
    def makeModel(self):
        self.createModel()
        self.fit()
        predictions = self.predict()
        self.evaluate(predictions)

    '''
    userId가 평점을 매긴 itemId들만 DataFrame로 반환
    userId : 사용자 아이디   

    self.ratings.iloc[:, 0]는 self.ratings 데이타 프레임의 0번째 컬럼 인덱스(userId컬럼)의 값을 의미
    .iloc[:, 1]는  itemId값만 가져오기 위한 코드(self.ratings 데이타 프레임의 1번째 컬럼 인덱스(itemId컬럼)이니까)
    '''

    def getRatingItems(self, userId):
        itemIds = pd.DataFrame(self.ratings[self.ratings.iloc[:, 0] == userId].iloc[:, 1])
        return itemIds

    '''
    userId가  특정 아이템에 대한 평점 부여 여부 확인
    userId : 사용자 아이디 
    itemId : 아이템 아이디    
    '''

    def isRating(self, userId, itemId):
        itemIds = self.getRatingItems(userId)
        # 0인덱스는 itemId값
        if not itemIds[itemIds.iloc[:, 0] == itemId].empty:
            return False
        return True

    '''
    특정 아이템에 대한 아이템 정보 출력    
    itemId : 아이템 아이디   
    '''

    def showItem(self, itemId):
        # 0인덱스는 itemId값
        return self.items[self.items.iloc[:, 0] == itemId]

    '''
    특정 유저가 평점을 주지 않은 아이템들을 리스트로 저장    
    userId : 사용자 아이디 
    '''

    def getNoRatingItem(self, userId):
        # # 데이터 형식 확인 및 변환
        ratings = self.ratings.iloc[:, 0].astype('str')

        # 결측값 확인 및 처리
        ratings = ratings.fillna('')

        # 문자열 포함 여부 확인
        # print('ratingItems', ratings.str.contains('81'))

        ratingItems = self.ratings[ratings.str.contains(userId)].iloc[:, 1].tolist()

        # 특정 유저가 평점을 준 아이템들을 리스트로 저장
        totalItems = self.items.iloc[:, 0].tolist()

        noRatingItems = [item for item in totalItems if item not in ratingItems]
        print('{}인 유저가 평점을 준 아이템 수:{},평점을 안준 아이템 수:{},전체 아이템 수:{}'.format(userId, len(ratingItems), len(noRatingItems),
                                                                          len(totalItems)))

        return noRatingItems

    '''
    예측 평점이 높은 최상위 n_top개의 추천 아이템 리스트로 반환
    userId : 사용자 아이디     
    noRatingItems : getNoRatingItem()함수에서 반환된 리스트
    n_top : 추천 상위 갯수.디폴트 10개
    '''

    def recommendItems(self, userId, noRatingItems, n_top=10):
        if len(noRatingItems) ==0:
            ratings = self.ratings.iloc[:, 0].astype('str')
            # 결측값 확인 및 처리
            ratings = ratings.fillna('')
            # topitemIds =
            return [(ids, rating) for ids, rating in zip(self.ratings[ratings.str.contains(userId)].head(n_top)['itemId'], self.ratings[ratings.str.contains(userId)].head(n_top)['rating'])]
        # userId가 평점을 안준  아이템에 대한  평점 예측
        predictions = [self.model.predict(str(userId), str(itemId)) for itemId in noRatingItems]
        # 예측 평점을 정렬
        predictions.sort(key=lambda pred: pred.est, reverse=True)
        # 상위 n_top개의 예측값들
        topPredictions = predictions[:n_top]
        print(topPredictions)

        # 상위 n_top개의 예측값들에서 itemId,rating,title 추출
        topitemIds = [pred.iid for pred in topPredictions]
        topItemRatings = [pred.est for pred in topPredictions]

        #
        return [(ids, rating) for ids, rating in zip(topitemIds, topItemRatings)]


if __name__ == '__main__':
    # 1. RecommendAlgorithm 객체 생성(csv파일 사용시)
    recommend = RecommendAlgorithm((0.5, 5), '../rating/rating.csv', '../rating/movie/movie.csv',
                                   itemColumn=['movieId', 'title', 'genre'])

    # 2. 모델 생성 및 훈련 그리고 예측및 평가
    recommend.makeModel()

    # 확인용
    # 확인용 첫번째-사용자 아이디가 100인 사람이 평점을 준 아이템들의 목록(리스트)
    itemIds = recommend.getRatingItems(100)
    print('사용자 아이디가 100인 사람이 평점을 준 아이템들:', itemIds)
    # 확인용 두번째 -사용자 아이디가 100인 사람이 1005번인 아이템에 대한 평점이 있는지 판단하기
    if not recommend.isRating(100, 1005):
        print('아이디 100인 사람은 영화 1005에 대한 평점이 없음')
    # 3. 사용자 아이디가 100인 사람이 평점을 매기지 않은 아이템들(리스트)
    noRatingItems = recommend.getNoRatingItem(100)
    print('사용자 아이디가 100인 사람이 평점을 매기지 않은 아이템 수:', len(noRatingItems))
    # 4.사용자 아이디가 100인 사람에게 평점을 하지 않은 아이템들 중에서 모델이 예측한 평점이
    #  높은 아이템들을 추천하기
    # topItemPreds=recommend.recommendItems(100, noRatingItems)#디폴트 10개
    topItemPreds = recommend.recommendItems(100, noRatingItems, 5)  # 5개 추천하기

    for item in topItemPreds:
        print('추천 아이템:{} 예측 평점:{}'.format(item[2], item[1]))
