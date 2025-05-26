from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.common.exceptions import TimeoutException
import json, time, os
import logging

#미트리 쇼핑몰 크롤링

def shop():

    # 스크립트 시작 부분에 추가
    logging.basicConfig(level=logging.INFO)

    driver = None  # driver 변수 초기화
    try:
        # 1. WebDriver 객체 생성
        driver_path = f'{os.path.join(os.path.dirname(__file__), "chromedriver.exe")}'
        service = Service(executable_path=driver_path)
        options = webdriver.ChromeOptions()
        # 자동종료 막기
        options.add_experimental_option("detach", True)  # 드라이버랑 detach하자
        # Headless Browser를 위한 옵션 설정
        options.add_argument('headless')
        # 일부 버그용
        options.add_argument('--disable-gpu')
        # 크기에 따른 요소 hidden 방지용
        options.add_argument('window-size=1920x1080')
        # 일부 사이트의 크롬 headless 모드 접근 금지 해결을 위한 설정
        # headless chrome 이 아닌 chrome 속임수용(User-Agent=Mozilla에서 띄어쓰기 없어야 한다)
        options.add_argument('User-Agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
        driver = webdriver.Chrome(service=service, options=options)

        logging.info("웹사이트로 이동 중...")

        driver.get(f'https://metree.co.kr/index/shop.php?r=list&cat=0021&p=1')

        title = driver.find_elements(By.XPATH, '//*[@id="container"]/div/section/article/ul/li/div[2]/a/p')
        link = driver.find_elements(By.XPATH, '//*[@id="container"]/div/section/article/ul/li/div[2]/a')
        thumbnail = driver.find_elements(By.XPATH, '//*[@id="container"]/div/section/article/ul/li/div[1]/a/img')
        price = driver.find_elements(By.XPATH, '//*[@id="container"]/div/section/article/ul/li/div[2]/a/div[2]/span[1]')
        summary = driver.find_elements(By.XPATH, '//*[@id="container"]/div/section/article/ul/li/div[2]/a/div[3]')
        stars = driver.find_elements(By.XPATH, '//*[@id="container"]/div/section/article/ul/li/div[2]/a/div[1]/div[2]/span[2]')
        reviewer = driver.find_elements(By.XPATH, '//*[@id="container"]/div/section/article/ul/li/div[2]/a/div[1]/div[2]/span[3]')


        shop_list = []
        for title, link, thumbnail, price, summary, stars, reviewer in zip(title, link, thumbnail, price, summary, stars, reviewer):
            shop_item = {
                "title": title.text,
                "link": link.get_attribute('href'),
                "thumbnail": thumbnail.get_attribute('src'),
                "price": price.text,
                "summary": summary.text,
                "stars": stars.text,
                "reviewer": reviewer.text
            }
            shop_list.append(shop_item)

        json_path = f'{os.path.join(os.path.dirname(__file__), "shop.json")}'
        with open(json_path, 'w', encoding='utf8') as f:
            f.write(json.dumps(shop_list, indent=4, ensure_ascii=False))

        for info in shop_list:
            print("제목:", info["title"])
            print("링크:", info["link"])
            print("썸네일:", info["thumbnail"])
            print("가격:", info["price"])
            print("요약:", info["summary"])
            print("별점:", info["stars"])
            print("리뷰수:", info["reviewer"])

    except TimeoutException as e:
        print('지정한 요소를 찾을 수 없어요:', e)

if __name__ == '__main__':
    shop()