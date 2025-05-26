import React, { useState } from 'react';
import '../../adminstyle/Rpost.css';
import AdminMain from '../../adminmain/AdminMain.js';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import RpostModal from './RpostModal.js'

function Rpost() {
  const [nameQuery, setNameQuery] = useState(''); // 이름 검색어 상태 변수
  const [titleQuery, setTitleQuery] = useState(''); // 제목 검색어 상태 변수
  const [pageNumber, setPageNumber] = useState(1); // 현재 페이지 번호 상태 변수
  const [members, setMembers] = useState([
    { id: 1, title: '신고된 게시글 1', content: '내용 1' },
    { id: 2, title: '신고된 게시글 2', content: '내용 2' },
    { id: 3, title: '신고된 게시글 3', content: '내용 3' },
    // 기타 데이터 추가
  ]);
  const [filteredMembers, setFilteredMembers] = useState(members); // 필터링된 회원 목록 상태 변수
  const [selectedMember, setSelectedMember] = useState(null); // 선택된 회원 상태 변수
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 상태 변수

  // 페이지 변경 핸들러 함수
  const handlePageChange = (pageNumber) => {
    setPageNumber(pageNumber);
  };

  // 검색 핸들러 함수
  const handleSearch = () => {
    const filtered = members.filter((member) => {
      const nameMatch = nameQuery && member.title.toLowerCase().includes(nameQuery.toLowerCase());
      const titleMatch = titleQuery && member.content.toLowerCase().includes(titleQuery.toLowerCase());
      return nameMatch || titleMatch;
    });
    setFilteredMembers(filtered);
  };

  // 이름 입력 변경 핸들러 함수
  const handleNameInputChange = (e) => {
    const value = e.target.value;
    setNameQuery(value);
    handleSearch();
  };

  // 제목 입력 변경 핸들러 함수
  const handleTitleInputChange = (e) => {
    const value = e.target.value;
    setTitleQuery(value);
    handleSearch();
  };

// 회원 클릭 핸들러 함수
const handleMemberClick = (member) => {
  // 선택된 회원이 유효한지 확인
  if (member) {
    console.log("isModalOpen before setting:", isModalOpen); // 확인용 로그
    setSelectedMember(member); // 모달이 열릴 때 선택된 회원을 설정
    setIsModalOpen(true); // 모달 열기
  }
};



  // 모달 닫기 핸들러 함수
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const membersPerPage = 10;
  const indexOfLastMember = pageNumber * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = filteredMembers.slice(indexOfFirstMember, indexOfLastMember);
  console.log("isModalOpen:", isModalOpen);
  console.log("selectedMember:", selectedMember);
  
  return (
    <div className='ASearch-Main'>
      <div className='Asearch-title'>
        <h1>신고된 게시글</h1>
      </div>
      <AdminMain />
      <div className="admin-Search">
        <div className="search-form">
          <input type="text" placeholder="이름으로 검색" value={nameQuery} onChange={handleNameInputChange} />
          <button onClick={handleSearch}>검색</button>
          <input type="text" placeholder="제목으로 검색" value={titleQuery} onChange={handleTitleInputChange} />
          <button onClick={handleSearch}>검색</button>
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
          <div className="date_picker dp" >
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
            </LocalizationProvider>
          </div>
        </div>
      </div>
      <div className="member-list ML">
        <ul>
          {currentMembers.map(member => (
            <li key={member.id} onClick={() => handleMemberClick(member)}>
              <h3>{member.title}</h3>
              <p>{member.content}</p>
            </li>        
          ))}
                  {isModalOpen && selectedMember !== null && (
          <RpostModal member={selectedMember} closeModal={handleCloseModal} />
          
        )}
        
        </ul>
      </div>
      <div className="pagination-container">
        <div className="pagination">
          <button onClick={() => handlePageChange(pageNumber - 1)} disabled={pageNumber === 1}>이전</button>
          {[...Array(Math.ceil(filteredMembers.length / membersPerPage)).keys()].map((page) => (
            <button key={page + 1} onClick={() => handlePageChange(page + 1)}>{page + 1}</button>
          ))}
          <button onClick={() => handlePageChange(pageNumber + 1)} disabled={pageNumber === Math.ceil(filteredMembers.length / membersPerPage)}>다음</button>
        </div>
      </div>
    </div>    
  );
}

export default Rpost;
