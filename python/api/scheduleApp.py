import schedule
import time
from model.crawling.crawling_recipe import recipe

# step2.실행할 함수 선언
def message():
    recipe()
    print('로딩...')

#플라스크가 아닌버전
# # step3.실행 주기 설정
# schedule.every(3).minutes.do(message)
# # schedule.every(3).seconds.do(message)
# 
# # step4.스캐쥴 시작
# while True:
#     schedule.run_pending()
#     time.sleep(1)