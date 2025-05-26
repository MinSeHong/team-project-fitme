import React, { useEffect, useState } from 'react';
import './MapBox.css'

function MapBox(props) {
    const [map, setMap] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        // Kakao 지도 API 로드
        const script = document.createElement('script');
        //API 키는 서버로 이용되는 사이트에 맞춰서 플랫폼이랑 변경해줘야 함
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=6a5e15de70e02e5170488cc321958391&autoload=false`;
        script.async = true;

        script.onload = () => {
            // API 로드 완료 후에 실행되는 콜백 함수
            // 지도 생성 및 표시 코드 추가
            const mapContainer = document.getElementById('map');
            const options = {
                center: new window.kakao.maps.LatLng(37.5665, 126.9780), // 지도의 중심 좌표
                level: 8 // 지도의 확대 레벨
            };
            const map = new window.kakao.maps.Map(mapContainer, options);
            setMap(map);
        };

        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, []);

    const handleInputChange = (e) => {
        setKeyword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 검색어로 장소 검색
        const places = await searchPlaces(keyword);

        // 검색된 장소들에 대해 마커 추가
        addMarkers(places);
    };

    const searchPlaces = async (keyword) => {
        return new Promise((resolve, reject) => {
            // 장소 검색 객체 생성
            const placesService = new window.kakao.maps.services.Places();

            // 키워드로 장소 검색 요청
            placesService.keywordSearch(keyword, (result, status) => {
                if (status === window.kakao.maps.services.Status.OK) {
                    // 검색 결과 반환
                    resolve(result);
                } else {
                    // 검색 실패 시 지도 위에 텍스트 표시
                    setShowError(true);

                    // 일정 시간 후에 오류 메시지 숨기기
                    setTimeout(() => {
                        setShowError(false);
                    }, 3000);
                }
            });
        });
    };

    const addMarkers = (places) => {
        if (window.infowindow) {
            window.infowindow.close();
        }

        markers.forEach((marker) => {
            marker.setMap(null);
        });
        markers.length = 0;

        const newMarkers = places.map((place) => {
            const marker = new window.kakao.maps.Marker({
                position: new window.kakao.maps.LatLng(place.y, place.x),
                map: map
            });

            const infowindow = new window.kakao.maps.InfoWindow({
                content: `<div style="color: #000; padding: 3px; font-size: 12px; border-radius: 5px; border: none; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    ${place.place_name}<br>
                    <a href="https://map.kakao.com/link/to/${place.id}" target="_blank" rel="noopener noreferrer">길 찾기</a>
                </div>`
            });

            window.kakao.maps.event.addListener(marker, 'click', () => {
                if (window.infowindow) {
                    window.infowindow.close();
                }
                if (window.infowindow === infowindow) {
                    window.infowindow = null;
                } else {
                    infowindow.open(map, marker);
                    window.infowindow = infowindow;
                }
            });

            markers.push(marker);

            return marker;
        });

         // 첫 번째 마커가 있는 위치로 지도 이동
        if (newMarkers.length > 0) {
            const firstMarkerPosition = newMarkers[0].getPosition();
            map.panTo(firstMarkerPosition);
        }
    };

    return (
        <div className="sideber-search-box" style={{backgroundColor:'#ffffff',boxShadow: '0px 5px 5px 5px rgba(0, 0, 0, 0.1)'}}>
            <div id="map" className="sidebar-map-box">
            {showError && (
                <div id="errorText" className="error-text">장소 검색에 실패했습니다.</div>
            )}
            </div>
            <div className="sidebar-search">
                <form onSubmit={handleSubmit}>
                    <input
                        className="form-control"
                        type="text"
                        name="search"
                        value={keyword}
                        onChange={handleInputChange}
                        placeholder="Search...."
                    />
                    <button className="button search-button" type="submit">
                        <i className="fas fa-search icon-manipulate" style={{marginTop:'15px'}}></i>
                    </button>
                </form>
            </div>
        </div>
    );
}

export default MapBox;
