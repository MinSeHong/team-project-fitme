from configparser import ConfigParser
from cx_Oracle import connect
import datetime as dt
import os

def connectDatabase():  # 데이타베이스 연결
    config = ConfigParser()
    # 데이터 절대경로 찾아주기
    path = os.path.dirname(os.path.abspath(__file__))
    print('path:',path)
    config.read(path + '/oracle.ini', encoding='utf8')
    # 데이타베이스 연결
    return connect(user=config['ORACLE']['user'],
                   password=config['ORACLE']['password'],
                   dsn=config['ORACLE']['URL'], encoding="UTF-8")


def close(conn):  # 커넥션객체 닫기
    if conn:
        conn.close()


def inbody_insert(conn, accountNo, list_):
    print(f'accountNo:{accountNo},\nlist_:{list_}')
    # test = []  # 캘린더 테이블
    # list_['SKELETAL_MUSCLE']  # 골격근량
    # list_['BODY_FAT_MASS']  # 체지방량
    # list_['BODY_FAT_PERCENTAGE']  # 체지방률
    # list_['BMI']  # BMI
    # list_['WEIGHT']  # 체중
    sql = f"INSERT INTO inbody VALUES({accountNo}, default, '{list_[1]}', '{list_[2]}' , '{list_[4]}', '{list_[3]}', '{list_[0]}',(SELECT height FROM inbody WHERE post_date = (SELECT MAX(post_date) FROM inbody WHERE account_no = '{accountNo}')))"
    with conn.cursor() as cursor:
        try:
            cursor.execute(sql)
            print('sql:',sql)
            conn.commit()
            return cursor.rowcount
        except Exception as e:
            print("입력시 오류:", e)
            return None

def inbody_select(conn, accountNo, date):
    with conn.cursor() as cursor:
        try:
            now = dt.datetime.now()
            cursor.execute(f"SELECT * FROM inbody WHERE account_no = {accountNo}")
            return cursor.fetchone()
        except Exception as e:
            print('레코드 하나 조회시 오류:', e)
            return None

def inbody_update(conn, accountNo, list_):
    test = []  # 캘린더 테이블
    test.append(accountNo)
    test.append(list_['SKELETAL_MUSCLE'])  # 골격근량
    test.append(list_['BODY_FAT_MASS'])  # 체지방량
    test.append(list_['BODY_FAT_PERCENTAGE'])  # 체지방률
    test.append(list_['BMI'])  # BMI
    test.append(list_['WEIGHT'])  # 체중
    sql = f"UPDATE inbody SET SKELETAL_MUSCLE={list_['SKELETAL_MUSCLE']},BODY_FAT_MASS={list_['BODY_FAT_MASS']},BODY_FAT_PERCENTAGE={list_['BODY_FAT_PERCENTAGE']},BMI={list_['BMI']},WEIGHT={list_['WEIGHT']} WHERE account_no={accountNo}"
    with conn.cursor() as cursor:
        try:
            cursor.execute(sql)
            conn.commit()
            return cursor.rowcount
        except Exception as e:
            print('수정시 오류:', e)
