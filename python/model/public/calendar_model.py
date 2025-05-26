from configparser import ConfigParser
from cx_Oracle import connect
import os

def connectDatabase():  # 데이타베이스 연결
    config = ConfigParser()
    # print(os.path.abspath('.'))
    # 데이터 절대경로 찾아주기
    path = os.path.dirname(os.path.abspath(__file__))
    # print(path)
    config.read(path + '/oracle.ini', encoding='utf8')
    # 데이타베이스 연결
    return connect(user=config['ORACLE']['user'],
                   password=config['ORACLE']['password'],
                   dsn=config['ORACLE']['URL'], encoding="UTF-8")


def close(conn):  # 커넥션객체 닫기
    if conn:
        conn.close()

def insert(conn, cal_id):
    with conn.cursor() as cursor:
        try:
            cursor.execute(f'INSERT INTO calendar_likes VALUES({cal_id},default)')
            conn.commit()
            return cursor.rowcount
        except Exception as e:
            print('error')
def delete(conn, cal_id):
    with conn.cursor() as cursor:
        try:
            cursor.execute(f'DELETE calendar_likes WHERE calendar_no = {cal_id}')
            conn.commit()
            return cursor.rowcount
        except Exception as e:
            print('error')