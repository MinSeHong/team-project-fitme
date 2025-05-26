import React, { useEffect, useLayoutEffect, useState } from 'react';
import './GameRoomContainer.css';
import { useNavigate } from 'react-router-dom';

function GameRoomContainer(props) {
  const navigate = useNavigate();

  console.log(props);
  const getGameModeImage = (gameMode) => {
    switch(gameMode) {
      case "game-mode-card squat":
        return require('../images/squat.jpg');
      case "game-mode-card pushUp":
        return require('../images/pushup.png');
      case "game-mode-card sitUp":
        return require('../images/sit-up.png');
      case "game-mode-card random":
        return require('../images/random.png');
      default:
        return require('../images/game_squat.png');
    }
  };

  const gameModeImage = getGameModeImage(props.data.gameMode);
  const handleContainerClick = () => {
    navigate(`/game/room?${props.data.gameroomNo}`, { state: { roomNo: props.data.gameroomNo } });
  };
  
  return (
    <div className="gameroom-container" onClick={handleContainerClick}>
      <div className='gameroom-people-count'>
          1/2
      </div>
      <div className="gameroom-icon"
      style={{ backgroundImage: `url(${gameModeImage})` }}>
      </div>

      <div className="gameroom-description">
        <div style={{fontSize:"20px", fontWeight:"600"}}>{props.data.roomName}
            <span>No.{props.data.gameroomNo}</span></div>
        <div>플레이 시간: 13 minutes</div>
        <div>방 생성자: 조동훈</div>
      </div>

      <div className='gameroom-button-layout'>
        <div className='gameroom-button'>
        <img src={require('../images/enter.png')}/>
        </div>
        <div className='gameroom-button'>
          <img src={require('../images/report.png')}/>
        </div>
        <div className='gameroom-button'>
          <img src={require('../images/detail.png')}/>
        </div>
      </div>
    </div>
  );
}

export default GameRoomContainer;