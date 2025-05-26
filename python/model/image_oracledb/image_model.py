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

def select(conn, id):
    with conn.cursor() as cursor:
        try:
            cursor.execute(
                f"select * FROM image WHERE image_no = {id}")
            return cursor.fetchone()
        except Exception as e:
            print('레코드 하나 조회시 오류:', e)
            return None

def insert(conn):
    with conn.cursor() as cursor:
        try:
            cursor.execute(f'INSERT INTO image VALUES(seq_image.nextval,default)')
            conn.commit()
            cursor.execute(f'select max(IMAGE_NO) FROM image')
            return cursor.fetchone()
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