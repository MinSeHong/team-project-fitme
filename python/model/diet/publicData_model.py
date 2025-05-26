import numpy as np
import pandas as pd
import os

def line(name):
    path = os.path.dirname(os.path.abspath(__file__))
    loc = path + '\\food_public.csv'
    # print(loc)
    df = pd.read_csv(loc, encoding='cp949')
    arr = ('식품명','영양성분함량기준량','에너지(kcal)','수분(g)','단백질(g)','지방(g)','회분(g)','탄수화물(g)')
    df1 = pd.DataFrame(df, columns=arr)
    df1.fillna(0, inplace=True)
    return (df1[df1['식품명']==name].values)[0]
def lineArr():
    # csv_data = np.loadtxt('amount_of_food.csv', delimiter=',')
    path = os.path.dirname(os.path.abspath(__file__))
    loc = path+"\\food_public.csv"
    # print(loc)
    df = pd.read_csv(loc,encoding='cp949')
    print(np.array(df['식품명']))
    '''
    Index(['식품코드', '식품명', '데이터구분코드', '데이터구분명', '식품기원코드', '식품기원명', '식품대분류코드',
       '식품대분류명', '대표식품코드', '대표식품명', '식품중분류코드', '식품중분류명', '식품소분류코드', '식품소분류명',
       '식품세분류코드', '식품세분류명', '영양성분함량기준량', '에너지(kcal)', '수분(g)', '단백질(g)',
       '지방(g)', '회분(g)', '탄수화물(g)', '당류(g)', '식이섬유(g)', '칼슘(mg)', '철(mg)',
       '인(mg)', '칼륨(mg)', '나트륨(mg)', '비타민 A(μg RAE)', '레티놀(μg)', '베타카로틴(μg)',
       '티아민(mg)', '리보플라빈(mg)', '니아신(mg)', '비타민 C(mg)', '비타민 D(μg)',
       '콜레스테롤(mg)', '포화지방산(g)', '트랜스지방산(g)', '출처코드', '출처명', '식품중량', '업체명',
       '데이터생성방법코드', '데이터생성방법명', '데이터생성일자', '데이터기준일자', '제공기관코드', '제공기관명'],
      dtype='object')
    '''
    # # print("path"+path)
    # print(df)
    # # return  df.values[df.values[:,0]==name]
    return np.array(df['식품명'])

if __name__ == '__main__':
    print(line('낙지전골'))
    # print(lineArr())