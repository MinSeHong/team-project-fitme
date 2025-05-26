import React, { useState, useEffect } from 'react';
import axios from 'axios';

import '../../adminstyle/Search.css';
import AdminMain from '../../adminmain/AdminMain.js';

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import 'dayjs/locale/ko';
import moment from "moment";
//npm install dayjs
import dayjs from 'dayjs';
import ADModal from '../../ADModal/ADModal.js';

function Search() {
  // 상태 변수 선언
  const [startDate, setStartDate] = useState(null); // 시작 날짜 상태 변수
  const [nameQuery, setNameQuery] = useState(''); // 이름 검색어 상태 변수
  const [titleQuery, setTitleQuery] = useState(''); // 제목 검색어 상태 변수
  const [pageNumber, setPageNumber] = useState(1); // 현재 페이지 번호 상태 변수
  const [showModal, setShowModal] = useState(false);//모달 호출 함수

  // 모달 정보 상태 변수 선언
  const [selectedMemberId, setSelectedMemberId] = useState(null); 
  // 모달 열기 함수
  const openModal = (memberId) => {
    setSelectedMemberId(memberId);
  };

  // 모달 닫기 함수
  const closeModal = () => {
    setSelectedMemberId(null);
  };

  // 체크박스 상태 변수 선언
  const [selectAll, setSelectAll] = useState(false);

  const [members, setMembers] = useState([ // 초기 회원 목록 상태 변수  
    { id: 1,image:'대체할 이미지',username:'12445@12321.com',주소:'서초구 서초대로',name: 'John', age: 30, hobby: 'Reading', enroll_date: '2022-01-01' },
    { id: 2, name: 'Alice', age: 25, hobby: 'Drawing', enroll_date: '2022-02-15' },
    { id: 3, name: 'Bob', age: 40, hobby: 'Music', enroll_date: '2021-12-10' },
    { id: 4, name: 'John', age: 30, hobby: 'Reading', enroll_date: '2022-01-01' },
    { id: 5, name: 'Alice', age: 25, hobby: 'Drawing', enroll_date: '2022-02-15' },
    { id: 6, name: 'Bob', age: 40, hobby: 'Music', enroll_date: '2021-12-10' },
    { id: 7, name: 'John', age: 30, hobby: 'Reading', enroll_date: '2022-01-01' },
    { id: 8, name: 'Alice', age: 25, hobby: 'Drawing', enroll_date: '2022-02-15' },
    { id: 9, name: 'Bob', age: 40, hobby: 'Music', enroll_date: '2021-12-10' },
    { id: 10, name: 'John', age: 30, hobby: 'Reading', enroll_date: '2022-01-01' },
    { id: 11, name: 'Alice', age: 25, hobby: 'Drawing', enroll_date: '2022-02-15' },
  ]);

  useEffect(() => {
    if (selectAll) {
      const allMemberIds = members.map((member) => member.id);
      setSelectedMemberIds(allMemberIds);
    } else {
      setSelectedMemberIds([]);
    }
  }, [selectAll, members]);

  // 선택된 회원 ID를 저장하는 상태 변수
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
      return;
    }

    // 이름 또는 제목으로 검색된 회원 정보를 필터링합니다.
    const filteredMembers = members.filter((member) => {
      // 검색어가 비어있는 경우 모든 회원을 반환합니다.
      if (!nameQuery && !titleQuery) return true;

      // 이름 또는 제목에 포함된 검색어가 있는지 확인합니다.
      const nameMatch = nameQuery && member.name.toLowerCase().includes(nameQuery.toLowerCase());
      const titleMatch = titleQuery && member.hobby.toLowerCase().includes(titleQuery.toLowerCase());
      // 이름 또는 제목 중 하나라도 검색어와 일치하는 경우 필터링합니다.
      return nameMatch || titleMatch;
    });
    // 필터링된 회원 정보를 저장합니다.
    setMembers(filteredMembers);
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

  // 한 페이지에 표시할 회원 수
  const membersPerPage = 10;

  // 현재 페이지의 회원 정보 계산
  const indexOfLastMember = pageNumber * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = members.slice(indexOfFirstMember, indexOfLastMember);

// 'handleDetailView' 함수 추가
const handleDetailView = (memberId) => {
  // 상세 조회 기능 구현
  console.log(`Detail view of member with ID ${memberId}`);
  // 모달 열기
  openModal(memberId);
};

  return (
    <div className='ASearch-Main'>
        <div className='Asearch-title'>
        <h1>블랙리스트 목록</h1>
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
          <div className="ifdate_picker" >
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
            <DemoContainer components={['DateTimePicker']}>
            <DatePicker 
            // value={selectOne != null ? selectOne[5] : ''}
            label="날짜 선택" 
            //value={dayjs(selectOne == '' || selectOne == null ? moment(value).format("YYYY-MM-DD 00:00") : selectOne[5])}
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
            {/* <div>{moment(value).format("YYYY-MM-DD 01:00")}</div> */}
            <div className="date_picker dp">
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">

                </LocalizationProvider>
            </div>
        </div>
      </div>
  
      {/* 회원 정보 목록 */}
      <div className="a-member-list">
        {/* 제목 */}   
        <div className="member-title">
          {/*전체 선택 체크박스*/}
        <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
        <label htmlFor="selectAll">전체 선택</label>
          <div className='checkbox'></div>
          <div className='name'>이름</div>
          <div className='age'>나이</div>
          <div className='hobby'>취미</div>
          <div className='enroll_date'>가입일</div>
        </div>
  
        {/* 회원 정보를 매핑하여 표시 */}
        {currentMembers.map((member) => (
          <div key={member.id} className="member-item">
            <div className='checkbox'>
              <input 
                type="checkbox" 
                checked={selectedMemberIds.includes(member.id)}
                onChange={() => handleCheckboxChange(member.id)}
              />
            </div>
            <div className='name'>{member.name}</div>
            <div className='age'>{member.age}</div>
            <div className='hobby'>{member.hobby}</div>
            <div className='enroll_date'>{member.enroll_date}</div>
            <div className='actions'>
              <button onClick={() => handleDetailView(member.id)}>상세 조회</button>
            </div>
          </div>
        ))}
      </div>
  
      <div className="pagination-container">
        {/* 페이징 컴포넌트 */}
        <div className="pagination">
          {/* 이전 페이지로 이동하는 버튼 */}
          <button onClick={() => handlePageChange(pageNumber - 1)} disabled={pageNumber === 1}>이전</button>
          
          {/* 페이지 번호를 매핑하여 표시 */}
          {[...Array(Math.ceil(members.length / membersPerPage)).keys()].map((page) => (
            <button key={page + 1} onClick={() => handlePageChange(page + 1)}>{page + 1}</button>
          ))}

          {/* 다음 페이지로 이동하는 버튼 */}
          <button onClick={() => handlePageChange(pageNumber + 1)} disabled={pageNumber === Math.ceil(members.length / membersPerPage)}>다음</button>
        </div>
      </div>
        {selectedMemberId !== null && (
          <ADModal
            member={members.find(member => member.id === selectedMemberId)}
            closeModal={closeModal}
          />
        )}
    </div>
  );
}

export default Search;
