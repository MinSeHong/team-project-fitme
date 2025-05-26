from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import json,time,os



def naver_crawling(query):
    try:
        # 1.WebDriver객체 생성
        driver_path=f'{os.path.join(os.path.dirname(__file__),"chromedriver.exe")}'
        service = Service(executable_path=driver_path)
        options = webdriver.ChromeOptions()
        # 자동종료 막기
        options.add_experimental_option("detach", True)  # 드라이버랑 detach하자
        # Headless Browser를 위한 옵션 설정
        options.add_argument('headless')
        # 일부 버그용
        options.add_argument('--disable-gpu')
        # 크기에 따른 요소 hidden방지용
        options.add_argument('window-size=1920x1080')
        # 일부 사이트의 크롬 headless 모드 접근 금지 해결을 위한 설정
        # headless chrome 이 아닌 chrome속임수용(User-Agent=Mozilla에서 띄어쓰기 없어야 한다)
        options.add_argument(
            'User-Agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
        driver = webdriver.Chrome(service=service, options=options)

        #query= input('검색할 운동을 입력하세요?')

        driver.get(f'https://search.naver.com/search.naver?where=view&sm=tab_jum&query={query}')

        title = driver.find_elements(By.XPATH, '//*[@id="main_pack"]/section/more-contents/div/ul/li/div/div[2]/div[1]/a')
        link = driver.find_elements(By.XPATH, '//*[@id="main_pack"]/section/more-contents/div/ul/li/div/div[2]/div[1]/a')
        thumbnail = driver.find_elements(By.XPATH, '//*[@id="main_pack"]/section/more-contents/div/ul/li/div/div[2]/div[3]/div/div[1]/a/img')
        summary = driver.find_elements(By.XPATH, '//*[@id="main_pack"]/section/more-contents/div/ul/li/div/div[2]/div[2]/a')
        bname = driver.find_elements(By.XPATH, '//*[@id="main_pack"]/section/more-contents/div/ul/li/div/div[1]/div[2]/div/a')


        blog_info = []
        for title, link, thumbnail, summary, bname in zip(title, link, thumbnail, summary, bname):
            info = {
                "제목": title.text,
                "링크": link.get_attribute('href'),
                "썸네일": thumbnail.get_attribute('src'),
                "요약": summary.text,
                "블로그 이름": bname.text
            }
            blog_info.append(info)

        # with open('exercise_blog.json','w',encoding='utf8') as f:
        #     f.write(json.dumps(blog_info,indent=4,ensure_ascii=False))
        return blog_info
    except TimeoutException as e:
        print('지정한 요소를 찾을수 없어요:', e)
    finally:
        driver.quit()

if __name__=='__main__':
    naver_crawling()