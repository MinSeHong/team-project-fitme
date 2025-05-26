// React 및 useEffect 가져오기
import React, { useEffect } from "react";
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import './GameRoomMakeModal.css';
import { useState } from 'react';
import $ from 'jquery';
import axios from "axios";
import {useNavigate} from 'react-router-dom';
import GameRoom from "../GameRoom";


import swal from 'sweetalert2';


// Modal 컴포넌트
function GameRoomMakeModal(props) {
    const [roomName, setRoomName] = useState("");

    const navigate = useNavigate();
    const disableScroll = () => {
        document.body.style.overflow = 'hidden';
    };
  
  const enableScroll = () => {
      document.body.style.overflow = 'auto';
  };

  useEffect(() => {
      disableScroll();

      return () => enableScroll();
  }, []);

  // 게임 모드 선택 상태 관리
  const [selectedGameMode, setSelectedGameMode] = useState("");

  // 쿠키에서 accountNo 가져오기
  const getAccountNoFromCookie = () => {
      const accountNo = getCookie('Authorization');
      console.log(`쿠키에서 가져온 accountNo: ${accountNo}`);
      return accountNo;
  };

  // 쿠키에서 값을 가져오는 함수
  const getCookie = (name) => {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          if (cookie.startsWith(name + '=')) {
              return cookie.substring(name.length + 1);
          }
      }
      return null;
  };
  
  const myCookieValue = getCookie('Authorization');

  function closeModal() {
      props.onClose();
  }

  const workoutType = (e) => {
      $(".game-mode-card-image").removeClass("card-click-active");
      $(e.target).closest('.game-mode-card').find(".game-mode-card-image").addClass("card-click-active");
      console.log(`게임 모드 선택: ${e.target.className}`);
      setSelectedGameMode(e.target.className);
  };

  // 게임 생성 함수
    const createGame = () => {
        console.log(`게임 생성 요청 시작: ${selectedGameMode}, myCookie: ${myCookieValue}, roomName: ${roomName}`);

        axios.post(`/api/v1/game/createRoom/${selectedGameMode}`,{
            gameMode: selectedGameMode, 
            accountNo: myCookieValue, 
            roomName: roomName,
        },{
            headers: {
                'Authorization' : `${myCookieValue}`,
                'Content-Type' : 'application/json; charset=UTF-8'
            }
        })
        .then(response => {
        console.log("게임 생성 성공", response.data);
        const gameroomNo = response.data.gameroomNo;
        swal.fire({
            icon: "success",
            title: "게임이 성공적으로 생성되었습니다."
          }); 
        navigate(`/game/room?${gameroomNo}`, { state: { roomNo: gameroomNo, ...response.data } });
        })
        .catch(error => {
        console.error("게임 생성 실패", error);
        swal.fire({
            icon: "warning",
            title: "게임 생성에 실패하였습니다."
          });
        });
    };



  return (
    <div className="Modal" onMouseDown={closeModal}>
        <div className="modalBody" onMouseDown={(e) => e.stopPropagation()} style={{width: '700px', height: '450px', overflow:"hidden", backgroundColor:"rgba(0,0,0,0)", boxShadow:"none"}}>
            <div className='game-room-modal-layout'>
                <div className="col-lg-12 col-sm-12 game-modal-layout">
                    <div className="game-room-modal-container grmc1">
                        <div className='game-room-modal-title'>Game Mode</div>
                        <input
                                className="game-room-modal-select"
                                placeholder="RoomName"
                                value={roomName}
                                onChange={(e) => setRoomName(e.target.value)}
                            />
                        <div className='game-room-modal-title'>People</div>
                        <div className="game-room-modal-select">2</div>
                    </div>
                    <div className="game-room-modal-container grmc2" onClick={workoutType}>
                        <OwlCarousel items={4} nav={false} dots={false}>
                            <div className="game-mode-card squat">
                                <div className='game-mode-card-image gmci1' style={{pointerEvents:"none"}}></div>
                                <div className='game-mode-card-title'>스쿼트</div>
                            </div>
                            <div className="game-mode-card pushUp">
                                <div className='game-mode-card-image gmci2'></div>
                                <div className='game-mode-card-title'>팔굽혀 펴기</div>
                            </div>
                            <div className="game-mode-card sitUp">
                                <div className='game-mode-card-image gmci3'></div>
                                <div className='game-mode-card-title'>윗몸 일으키기</div>
                            </div>
                            <div className="game-mode-card random">
                                <div className='game-mode-card-image gmci4'></div>
                                <div className='game-mode-card-title'>랜덤 게임</div>
                            </div>
                        </OwlCarousel>
                    </div>
                    <div className="game-room-modal-container grmc3">
                        <button className='game-room-modal-button' onClick={createGame}>게임 생성</button>
                        <button className='game-room-modal-button' onMouseDown={closeModal}>취소</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
);
}

export default GameRoomMakeModal;