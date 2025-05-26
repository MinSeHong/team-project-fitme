import React, { useState } from 'react';
import axios from 'axios'; // axios 라이브러리를 import 합니다.

import AdminMain from '../../adminmain/AdminMain.js'
import GameMmodal from './GameMmodal';

import '../../adminstyle/Search.css';
import '../../adminstyle/GameM/GameM.css';
import '../../adminstyle/ADPosting.css';

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'dayjs/locale/ko';

function GameM() {
  // 상태 변수 선언
  const [nameQuery, setNameQuery] = useState(''); // 이름 검색어 상태 변수
  const [titleQuery, setTitleQuery] = useState(''); // 제목 검색어 상태 변수
  const [gameRecords, setGameRecords] = useState([
    // 초기 게임 기록 상태 변수
    { id: 1, gameName: '게임1', participants: ['John', 'Alice', 'Bob'], winner: 'John', points: 100, date: '2024-03-04' },
    { id: 2, gameName: '게임2', participants: ['Alice', 'Bob'], winner: 'Bob', points: 50, date: '2024-03-03' },
    { id: 3, gameName: '게임3', participants: ['John', 'Bob'], winner: 'John', points: 80, date: '2024-03-02' },
    { id: 4, gameName: '게임4', participants: ['John', 'Alice', 'Bob'], winner: 'John', points: 100, date: '2024-03-04' },
    { id: 5, gameName: '게임5', participants: ['Alice', 'Bob'], winner: 'Bob', points: 50, date: '2024-03-03' },
    { id: 6, gameName: '게임6', participants: ['John', 'Bob'], winner: 'John', points: 80, date: '2024-03-02' },
    { id: 7, gameName: '게임7', participants: ['John', 'Alice', 'Bob'], winner: 'John', points: 100, date: '2024-03-04' },
    { id: 8, gameName: '게임8', participants: ['Alice', 'Bob'], winner: 'Bob', points: 50, date: '2024-03-03' },
    { id: 9, gameName: '게임9', participants: ['John', 'Bob'], winner: 'John', points: 80, date: '2024-03-02' },
    { id: 10, gameName: '게임10', participants: ['John', 'Alice', 'Bob'], winner: 'John', points: 100, date: '2024-03-04' },
    { id: 11, gameName: '게임11', participants: ['Alice', 'Bob'], winner: 'Bob', points: 50, date: '2024-03-03' },
    { id: 12, gameName: '게임12', participants: ['John', 'Bob'], winner: 'John', points: 80, date: '2024-03-02' },
    // 추가적인 게임 기록들...
  ]);

  const [selectedGame, setSelectedGame] = useState(null); // 선택된 게임 기록 상태 변수
  const [modalOpen, setModalOpen] = useState(false); // 모달 열림 상태 변수
  const [startDate, setStartDate] = useState(null); // 시작 날짜 상태 변수
  const [pageNumber, setPageNumber] = useState(1); // 현재 페이지 번호 상태 변수
  const recordsPerPage = 10; // 페이지 당 게임 기록 수

  // 게임 기록 페이징 함수
  const paginate = (pageNumber) => {
    setPageNumber(pageNumber);
  };

  // 현재 페이지의 게임 기록 계산
  const indexOfLastRecord = pageNumber * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = gameRecords.slice(indexOfFirstRecord, indexOfLastRecord);

  // 검색 함수
  const handleSearch = () => {
    // 이름, 제목, 날짜로 검색된 게임 기록을 필터링합니다.
    const filteredGameRecords = gameRecords.filter((record) => {
      // 검색어가 비어있는 경우 모든 게임 기록을 반환합니다.
      if (!nameQuery && !titleQuery && !startDate) return true;

      // 이름, 제목, 날짜에 대한 매칭 여부를 확인합니다.
      const nameMatch = nameQuery && record.participants.some(participant => participant.toLowerCase().includes(nameQuery.toLowerCase()));
      const titleMatch = titleQuery && record.gameName.toLowerCase().includes(titleQuery.toLowerCase());
      const dateMatch = startDate && record.date === startDate;

      // 이름, 제목, 날짜 중 하나라도 매칭되는 경우 필터링합니다.
      return (nameMatch || titleMatch || dateMatch);
    });

    // 필터링된 게임 기록을 저장합니다.
    setGameRecords(filteredGameRecords);
    // 검색 후 첫 페이지로 이동
    setPageNumber(1);
  };

  // 이름 입력 필드 변경 처리 함수
  const handleNameInputChange = (e) => {
    const value = e.target.value;
    setNameQuery(value);
  };

  // 제목 입력 필드 변경 처리 함수
  const handleTitleInputChange = (e) => {
    const value = e.target.value;
    setTitleQuery(value);
  };

  // 모달 열기 함수
  const openModal = (game) => {
    setSelectedGame(game);
    setModalOpen(true);
  };

  // 모달 닫기 함수
  const closeModal = () => {
    setSelectedGame(null);
    setModalOpen(false);
  };

  // 날짜 선택 핸들러 수정
  const handleDateChange = (date) => {
    const formattedDate = date ? date.format("YYYY-MM-DD") : null; // 선택된 날짜를 "YYYY-MM-DD" 형식의 문자열로 변환
    setStartDate(formattedDate);
  };

  return (
    <div className='ASearch-Main'>
      <div className='Asearch-title'>
        <h1>게임 목록</h1>
      </div>
      <AdminMain />
      <div className="admin-Search GAS">
        {/* 검색 폼 */}
        <div className="search-form">
          {/* 이름으로 검색 */}
          <input type="text" placeholder="이름으로 검색" value={nameQuery} onChange={handleNameInputChange} />
          <button onClick={handleSearch}>검색</button>
          {/* 제목으로 검색 */}
          <input type="text" placeholder="제목으로 검색" value={titleQuery} onChange={handleTitleInputChange} />
          <button onClick={handleSearch}>검색</button>
          {/* 날짜 선택 기능 */}
          <div className="ifdate_picker">
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
              <DemoContainer components={['DateTimePicker']}>
                <DatePicker
                  label="날짜 선택"
                  onChange={handleDateChange} 
                  slotProps={{
                    textField: {
                      size: "small",
                      format: 'YYYY-MM-DD',
                      style: { overflow: 'hidden', width: '40px' }
                    },
                  }}
                />
              </DemoContainer>
            </LocalizationProvider>
          </div>
        </div>
        {/* 게임 기록 표시 */}
        <div className="game-records">
          <ul>
            {currentRecords.map(record => (
              <li key={record.id} onClick={() => openModal(record)}>
                <p>게임 이름: {record.gameName}</p>
                <p>참여자: {record.participants.join(', ')}</p>
                <p>진행 날짜:{record.date}</p>
              </li>
            ))}
          </ul>
        </div>
        {/* 모달 */}
        <GameMmodal isOpen={modalOpen} handleClose={closeModal} gameRecord={selectedGame} />
        {/* 페이징 */}
          <div className="pagination PASN" style={{paddingLeft:'300px'}}>
            <button onClick={() => paginate(pageNumber - 1)} disabled={pageNumber === 1}>이전</button>
            {gameRecords.length > 0 && Array.from({ length: Math.ceil(gameRecords.length / recordsPerPage) }, (_, i) => (
              <button key={i + 1} onClick={() => paginate(i + 1)}>{i + 1}</button>
            ))}
            <button onClick={() => paginate(pageNumber + 1)} disabled={pageNumber === Math.ceil(gameRecords.length / recordsPerPage)}>다음</button>
          </div>
      </div>
    </div>
  );
}

export default GameM;
