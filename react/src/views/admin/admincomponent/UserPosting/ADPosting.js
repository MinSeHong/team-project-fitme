import React, { useState, useEffect } from 'react';
import axios from 'axios';

import AdminMain from'../../adminmain/AdminMain.js';
import '../../adminstyle/ADPosting.css';

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import 'dayjs/locale/ko';
import moment from "moment";
import dayjs from 'dayjs';
import ADPModal from './ADPModal.js';

function ADPosting() {
  // 게시글 데이터
  const posts = [
    { id: 1,image:'대체할 이미지', title: '첫 번째 게시글',name:'Alice',content: '첫 번째 게시글 내용' },
    { id: 2,image:'대체할 이미지', title: '두 번째 게시글',name:'Bob', content: '두 번째 게시글 내용' },
    { id: 3,image:'대체할 이미지', title: '세 번째 게시글',name:'John', content: '세 번째 게시글 내용' },
    { id: 4,image:'대체할 이미지', title: '네 번째 게시글',name:'John', content: '네 번째 게시글 내용' },
    { id: 5,image:'대체할 이미지', title: '다섯 번째 게시글',name:'John', content: '다섯 번째 게시글 내용' },
    { id: 6,image:'대체할 이미지', title: '여섯 번째 게시글',name:'John', content: '여섯 번째 게시글 내용' },
    { id: 7,image:'대체할 이미지', title: '일곱 번째 게시글',name:'John', content: '일곱 번째 게시글 내용' },
    { id: 8,image:'대체할 이미지', title: '여덟 번째 게시글',name:'John', content: '여덟 번째 게시글 내용' },
    { id: 9,image:'대체할 이미지', title: '아홉 번째 게시글',name:'John', content: '아홉 번째 게시글 내용' },
    { id: 10,image:'대체할 이미지', title: '열 번째 게시글',name:'John', content: '열 번째 게시글 내용' },
    { id: 11,image:'대체할 이미지', title: '열 한 번째 게시글',name:'John', content: '열 한 번째 게시글 내용' },
    // 나머지 게시글 데이터
  ];

  // 상태 변수 선언
  const [startDate, setStartDate] = useState(null); // 시작 날짜 상태 변수
  const [nameQuery, setNameQuery] = useState(''); // 이름 검색어 상태 변수
  const [titleQuery, setTitleQuery] = useState(''); // 제목 검색어 상태 변수
  const [pageNumber, setPageNumber] = useState(1); // 현재 페이지 번호 상태 변수
  const [showModal, setShowModal] = useState(false);//모달 호출 함수

  // 모달 정보 상태 변수 선언
  const [selectedMemberId, setSelectedMemberId] = useState(null); 
// 모달 열기 함수
    const openModal = (postId) => {
    setSelectedMemberId(postId); // 게시글 ID를 선택된 멤버 ID로 설정
};

  // 모달 닫기 함수
  const closeModal = () => {
    setSelectedMemberId(null);
  };

  // 체크박스 상태 변수 선언
  const [selectAll, setSelectAll] = useState(false);

  // 회원 목록 상태 변수 선언
  const [members, setMembers] = useState([]);

  // 선택된 회원 ID 목록 상태 변수 선언
  const [selectedMemberIds, setSelectedMemberIds] = useState([]);

  // 'handleSelectAll' 함수 정의
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      // 전체 선택 상태일 때
      const allMemberIds = members.map((member) => member.id);
      setSelectedMemberIds(allMemberIds);
    } else {
      // 전체 선택 해제 상태일 때
      setSelectedMemberIds([]);
    }
  };

  // 페이징 기능 구현 함수
  const handlePageChange = (pageNumber) => {
    setPageNumber(pageNumber);
  };

  // 검색 기능 구현 함수
  const handleSearch = () => {
    // 검색어가 비어있는 경우 전체 회원 목록을 표시합니다.
    if (!nameQuery && !titleQuery) {
      // 데이터를 초기화하거나, 새로 불러오는 로직 구현
      return;
    }

    // 이름 또는 제목으로 검색된 게시글 정보를 필터링합니다.
    // 여기서는 posts 변수를 이용하여 검색 결과를 구현하면 됩니다.

  };

  // 이름 입력 필드 변경 처리 함수
  const handleNameInputChange = (e) => {
    const value = e.target.value;
    setNameQuery(value);
    handleSearch(); // 입력 값이 변경되었을 때마다 검색 함수 호출
  };

  // 제목 입력 필드 변경 처리 함수
  const handleTitleInputChange = (e) => {
    const value = e.target.value;
    setTitleQuery(value);
    handleSearch(); // 입력 값이 변경되었을 때마다 검색 함수 호출
  };

  // 체크박스가 변경될 때 호출되는 함수
  const handleCheckboxChange = (memberId) => {
    // 이미 선택된 회원인지 확인
    const selectedIndex = selectedMemberIds.indexOf(memberId);
    if (selectedIndex === -1) {
      // 선택되지 않은 경우, 선택 목록에 추가
      setSelectedMemberIds([...selectedMemberIds, memberId]);
    } else {
      // 이미 선택된 경우, 선택 목록에서 제거
      setSelectedMemberIds(selectedMemberIds.filter((id) => id !== memberId));
    }
  };

  // 한 페이지에 표시할 게시글 수
  const postsPerPage = 10;

  // 현재 페이지의 게시글 정보 계산
  const indexOfLastPost = pageNumber * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);


// 게시물 상세 정보 모달 열기 함수
const handleDetailView = (postId) => {
    // 상세 조회 기능 구현
    console.log(`Detail view of post with ID ${postId}`);
    // 모달 열기
    if (postId) {
      openModal(postId); // 게시글 ID를 직접 전달
    }
};
  return (
    <div className="ad-posting-container">
      <AdminMain />
      <div className='Asearch-title ASPT'>
        <h1>게시글 목록</h1>
      </div>
  
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
          <div className="date_picker dp">

          </div>
        </div>
      </div>
  
      <ul className="post-list">
        {/* 각 게시글을 리스트 형태로 표시 */}
        {currentPosts.map((post) => (
          <li key={post.id} onClick={() => handleDetailView(post.id)}>
            <img src={post.image} alt="대체할 이미지" /> {/* 이미지 추가 */}
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <p>{post.name}</p> {/* 이름 추가 */}
          </li>
        ))}
      </ul>
      
      {/* 페이징 */}
      <div className="pagination" style={{paddingBottom:'50px'}}>
        <button onClick={() => handlePageChange(pageNumber - 1)}>이전</button>
        {[...Array(Math.ceil(posts.length / postsPerPage)).keys()].map((number) => (
          <button key={number + 1} onClick={() => handlePageChange(number + 1)}>
            {number + 1}
          </button>
        ))}
        <button onClick={() => handlePageChange(pageNumber + 1)}>다음</button>
      </div>

        {/* 모달 렌더링 */}
        {selectedMemberId !== null && (
        <ADPModal
            post={posts.find(post => post.id === selectedMemberId)} // 선택된 게시글 정보 전달
            closeModal={closeModal}
        />
        )}
    </div>
  );  
}

export default ADPosting;
