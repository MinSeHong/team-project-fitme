from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import  By
import os,time#표준 라이브러리

def google_crawling(title):
    try:
        # 1.WebDriver객체 생성
        driver_path=f'{os.path.join(os.path.dirname(__file__),"chromedriver.exe")}'
        service = Service(executable_path=driver_path)
        options = webdriver.ChromeOptions()

        # 자동종료 막기
        #options.add_experimental_option("detach", True)  # 드라이버랑 detach하자
        # Headless Browser를 위한 옵션 설정
        options.add_argument('headless')
        options.add_argument('--disable-gpu')
        # 크기에 따른 요소 hidden방지용
        options.add_argument('window-size=1920x1080')

        options.add_argument('User-Agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
        driver = webdriver.Chrome(service=service, options=options)

        driver.get(f'https://www.google.com/search?q={title}')

        scroll_height = driver.execute_script('return document.body.scrollHeight')
        print('scroll_height(스크롤 전):', scroll_height)
        while True:
            # 자바스크립트(자동으로)로 아래로 스크롤하기:window.scrollTo(x좌표,y좌표)
            driver.execute_script(f'window.scrollTo(0,{scroll_height})')
            # 컨텐츠가 로드될때까지 다음 코드 진행을 멈춘다
            time.sleep(2)
            # 스크롤후 높이 다시 구하기
            scroll_height_new = driver.execute_script('return document.body.scrollHeight')
            print('scroll_height(스크롤 후):', scroll_height_new)
            if  scroll_height==scroll_height_new:
                break
            #다시 scroll_height를 새로운 높이로 업데이트
            scroll_height=scroll_height_new

            local = driver.find_elements(By.CSS_SELECTOR,
                                         'div > div > div > div > div > div.kb0PBd.cvP2Ce.jGGQ5e > div > div > span > a > h3')
            link = driver.find_elements(By.CSS_SELECTOR,
                                        'div > div > div > div > div.kb0PBd.cvP2Ce.jGGQ5e > div > div > span > a')
            #WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.CSS_SELECTOR, '#mCSB_3_container > ul > li')))
            ##rso > div:nth-child(1) > div > div > div > div.kb0PBd.cvP2Ce.LnCrMe.QgmGr > div > a > div

            print(len(local))
            # local.send_keys(Keys.ENTER)
            check = 0
            list_ = []
            for i in range(len(local)):
                if ('naver' not in str(link[i].get_attribute('href'))) and ('namu' not in str(link[i].get_attribute('href'))):
                    try:
                        print(link[i].find_element('img'))

                    except Exception as e:
                        print('No Image')
                    check = check + 1
                    list_.append(dict(zip(('title','link'),(local[i].text,link[i].get_attribute('href')))))
                    if check >= 5:
                        return list_


    except Exception as e:
        print('error:',e)

if __name__ == '__main__':
    print(google_crawling('유부초밥레시피'))
    print(google_crawling('벤치프레스방법'))
