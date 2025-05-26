from flask import request, jsonify
from googleapiclient.discovery import build
import pandas as pd
import os


DEVELOPER_KEY = "AIzaSyDSEnPCH9ejzYKrTqKNEM8lFEXhQHwyu4o"
# DEVELOPER_KEY = os.environ.get("YOUTUBE_API")  # 환경 변수에서 YouTube API 키 값

YOUTUBE_API_SERVICE_NAME = "youtube"
YOUTUBE_API_VERSION = "v3"

# YouTube API 클라이언트를 생성
youtube = build(YOUTUBE_API_SERVICE_NAME, YOUTUBE_API_VERSION, developerKey=DEVELOPER_KEY)

def youtube1(keywords):
    # 사용자 요청 본문에서 키워드를 가져 온다
    # keywords = request.json['keywords']
    data = []

    # 각 키워드에 대해 YouTube 검색을 실행
    # for query in keywords:
    # YouTube 검색 요청을 생성하고 실행
    search_response = youtube.search().list(
        q=keywords,
        order="viewCount",  # 조회수
        part="snippet",  # 검색 결과에 제목,설명,썸네일,채널정보 포함
        maxResults=50  # 최대 50개의 검색 결과를 반환
    ).execute()

    # 검색 결과의 각 비디오에 대해 추가 정보를 가져 온다
    for search_result in search_response['items']:
        # 비디오 ID를 가져 온다
        videoid = search_result['id']['videoId']

        # 비디오의 추가 정보를 요청하고 가져 온다
        video_response = youtube.videos().list(
            part="snippet,contentDetails,statistics",  # 스니펫, 컨텐츠 세부 정보, 통계를 포함
            id=videoid  # 비디오 ID를 지정
        ).execute()

        # 비디오의 통계 정보를 가져 온다
        video_stats = video_response['items'][0]['statistics']

        # 통계 정보에 키워드, 제목, 채널 이름, URL을 추가
        video_stats.update({
            'key': keywords,
            'title': search_result['snippet']['title'],
            'channel': search_result['snippet']['channelTitle'],
            'url': f'https://www.youtube.com/embed/{videoid}'  # YouTube 비디오의 URL을 생성
        })
        # 최종 결과 데이터에 추가
        data.append(video_stats)

    # 최종 결과 데이터를 DataFrame으로 변환
    df = pd.DataFrame(data)

    # 조회수를 정수로 변환
    df['viewCount'] = df['viewCount'].astype(int)

    # 각 키워드별로 'viewCount'를 기준으로 내림차순으로 정렬하고 상위 5개의 결과만 선택
    df = df.groupby('key').apply(lambda x: x.sort_values('viewCount', ascending=False).head(2)).reset_index(drop=True)

    # DataFrame을 JSON 형태로 변환하여 반환
    return df.to_dict(orient='records')