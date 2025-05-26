import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../../adminstyle/Aheader.css';
import '../../adminstyle/Rcomment.css';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import AdminMain from '../../adminmain/AdminMain.js'

function Rcomment() {
  const [nameQuery, setNameQuery] = useState(''); // 이름 검색어 상태 변수
  const [titleQuery, setTitleQuery] = useState(''); // 제목 검색어 상태 변수
  const [startDate, setStartDate] = useState(null); // 시작 날짜 상태 변수
  const [pageNumber, setPageNumber] = useState(1); // 현재 페이지 번호 상태 변수
  const [comments, setComments] = useState([
    { id: 1, content: '신고된 댓글 1 내용' },
    { id: 2, content: '신고된 댓글 2 내용' },
    { id: 3, content: '신고된 댓글 3 내용' },
    // 기타 데이터 추가
  ]);

  // 페이징 기능 구현 함수
  const handlePageChange = (pageNumber) => {
    setPageNumber(pageNumber);
  };

  // 검색 기능 구현 함수
  const handleSearch = () => {
    // 검색어가 비어있는 경우 전체 댓글을 보여줍니다.
    if (!nameQuery && !titleQuery && !startDate) {
      return comments;
    }

    // 이름 또는 제목으로 검색된 댓글을 필터링합니다.
    const filteredComments = comments.filter((comment) => {
      // 검색어가 비어있는 경우 모든 댓글을 반환합니다.
      if (!nameQuery && !titleQuery) return true;

      // 이름 또는 제목에 포함된 검색어가 있는지 확인합니다.
      const nameMatch = nameQuery && comment.content.toLowerCase().includes(nameQuery.toLowerCase());
      const titleMatch = titleQuery && comment.content.toLowerCase().includes(titleQuery.toLowerCase());
      // 이름 또는 제목 중 하나라도 검색어와 일치하는 경우 필터링합니다.
      return nameMatch || titleMatch;
    });
    return filteredComments;
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

  // 날짜 선택 변경 처리 함수
  const handleDateChange = (date) => {
    setStartDate(date);
  };

  // 댓글 삭제 함수
  const handleDeleteComment = (id) => {
    // id에 해당하는 댓글을 삭제하는 로직을 추가합니다.
    // 예시: axios.delete(`/api/comments/${id}`).then(() => {
    //      setComments(comments.filter(comment => comment.id !== id));
    //    });
  };

  // 한 페이지에 표시할 댓글 수
  const commentsPerPage = 10;

  // 현재 페이지의 댓글 정보 계산
  const indexOfLastComment = pageNumber * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = handleSearch().slice(indexOfFirstComment, indexOfLastComment);

  return (
    <div className='ASearch-Main'>
      <div className='Asearch-title'>
        <h1>신고된 댓글 관리</h1>
      </div>
      <AdminMain />
      <div className="admin-Search">
        {/* 검색 폼 */}
        <div className="search-form">
          {/* 이름으로 검색 */}
          <input type="text" placeholder="이름으로 검색" value={nameQuery} onChange={handleNameInputChange} />
          <button onClick={() => handleSearch('name')}>검색</button>
          {/* 제목으로 검색 */}
          <input type="text" placeholder="제목으로 검색" value={titleQuery} onChange={handleTitleInputChange} />
          <button onClick={() => handleSearch('title')}>검색</button>
          {/* 날짜 선택 기능 */}
          <div className="ifdate_picker">
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
              <DemoContainer components={['DateTimePicker']}>
                <DatePicker 
                  label="날짜 선택" 
                  slotProps={{
                    textField: {
                      size: "small",
                      format: 'YYYY-MM-DD',
                      style: { overflow:'hidden',width:'40px'}
                    },              
                  }}
                />
              </DemoContainer>
            </LocalizationProvider>
          </div>
        </div>
      </div>
      <div className="comment-list ML">
        <ul>
          {currentComments.map(comment => (
            <li key={comment.id}>
              <p>{comment.content}</p>
              <div className="button-container">
                {/* 댓글 삭제 버튼 */}
                <button onClick={() => handleDeleteComment(comment.id)}>삭제</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="pagination-container">
        {/* 페이징 컴포넌트 */}
        <div className="pagination">
          {/* 이전 페이지로 이동하는 버튼 */}
          <button onClick={() => handlePageChange(pageNumber - 1)} disabled={pageNumber === 1}>이전</button>
          
          {/* 페이지 번호를 매핑하여 표시 */}
          {[...Array(Math.ceil(comments.length / commentsPerPage)).keys()].map((page) => (
            <button key={page + 1} onClick={() => handlePageChange(page + 1)}>{page + 1}</button>
          ))}

          {/* 다음 페이지로 이동하는 버튼 */}
          <button onClick={() => handlePageChange(pageNumber + 1)} disabled={pageNumber === Math.ceil(comments.length / commentsPerPage)}>다음</button>
        </div>
      </div>
    </div>
  );
};

export default Rcomment;
