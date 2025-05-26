import React from 'react';
import '../../adminstyle/GameM/GameMmodal.css';

const GameMmodal = ({ isOpen, handleClose, gameRecord }) => {
  // gameRecord가 null이면 빈 객체로 초기화
  const record = gameRecord || {};

  return (
    <div className={`modal  ${isOpen ? 'open' : ''}`}>
      <div className="GMO">
        <span className="close" onClick={handleClose}>&times;</span>
        <h2>{record.gameName}</h2>
        <div className="details">
          <p><strong>게임 방 이름:</strong> {record.gameName}</p>
          <p><strong>참여자:</strong> {record.participants && record.participants.join(', ')}</p>
          <p><strong>이긴 사람:</strong> {record.winner}</p>
          <p><strong>지급 포인트:</strong> {record.points}</p>
          <p><strong>날짜:</strong> {record.date}</p>
        </div>
      </div>
    </div>
  );
};

export default GameMmodal;
