from flask_restful import Resource
from flask import make_response
import  json
from model.diet.foods_recommend import RecommendAlgorithm
import model.diet.publicData_model as  publicModel
import model.workout.youtube as youtube

class FoodsRecommend(Resource):

    def __init__(self):

        #방법1)CSV파일 사용시
        #self.dbconnect('ratings.csv','items.csv')
        #방법2)데이타 프레임 사용시
        self.ratings = None
        self.items = None

    def get(self,username):
        # 1. RecommendAlgorithm 객체 생성
        #방법1)csv파일 사용시
        #recommend = RecommendAlgorithm((1, 5),itemColumn=['itemId', 'food'])
        #방법21)데이타 프레림 사용시
        recommend = RecommendAlgorithm((1, 5),  itemColumn=['itemId'])

        # 2. 모델 생성 및 훈련
        recommend.createModel()
        recommend.fit()

        # 확인용
        # 확인용 첫번째-사용자 아이디가 username인 사람이 평점을 준 아이템들의 목록(리스트):1001,1002,1010
        itemIds = recommend.getRatingItems(username)
        print(f'사용자 아이디가 "{username}"인 사람이 평점을 준 아이템들:{itemIds}')
        # 확인용 두번째 -사용자 아이디가 username인 사람이 1005번인 아이템에 대한 평점이 있는지 판단하기
        if not recommend.isRating(username, 1005):
            print('아이디 "KIM"인 사람은 영화 1005에 대한 평점이 없음')
        # 3. 사용자 아이디가 "KIM"인 사람이 평점을 매기지 않은 아이템들(리스트)
        noRatingItems = recommend.getNoRatingItem(username)
        print(f'사용자 아이디가 "{username}"인 사람이 평점을 매기지 않은 아이템 수:{len(noRatingItems)}')#7
        # 4.사용자 아이디가 username인 사람이 평점을 하지 않은 아이템들 중에서 모델이 예측한 평점이
        #  높은 아이템들을 추천하기
        topItemPreds = recommend.recommendItems(username, noRatingItems, 3)  # 3개 추천하기

        recommend_items = []
        for item in topItemPreds:
            print('추천 아이템:{} 예측 평점:{}'.format(item[0], list(publicModel.line(item[0]))))
            # print(youtube.youtube1(item[0]))
            # data = youtube.youtube1(item[0])
            # print(data)
            # recommend_items.append({'food': item[0], 'rank': list(publicModel.line(item[0])), 'youtube' : data})
            recommend_items.append({'food': item[0], 'rank': list(publicModel.line(item[0]))})

        return make_response(json.dumps({'items':recommend_items},ensure_ascii=False))












