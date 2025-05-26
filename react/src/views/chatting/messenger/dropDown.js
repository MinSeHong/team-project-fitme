import React, {  useState, useEffect, useRef } from 'react';
import 'material-symbols';
import './dropDown.css';
import axios from 'axios';


function getCookie(name) { //로그인 여부 확인
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(name + '=')) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
}

const DropDown = (props) => {

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const onToggle = () => {
    setIsOpen(!isOpen);
  };


  // 드롭다운 외부 클릭 감지 함수
  const handleClickOutside = (event) => {
    // dropdownRef가 존재하고, 클릭된 요소가 dropdownRef 안에 없으면
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // 드롭다운 닫기
        setIsOpen(false);
      }
    };

    useEffect(() => {
    // 마운트될 때 외부 클릭 이벤트 리스너 추가
    document.addEventListener('mousedown', handleClickOutside);
    // 언마운트될 때 이벤트 리스너 제거
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
    }, []); // 빈 배열은 마운트/언마운트 시에만 실행됨
    //상태 확인
    function checkOk(e){
      e.preventDefault();
      const test = e.target.textContent;
      if('방 나가기' == test){
        if(window.confirm('정말 나가시겠습니까?')){
          const myCookieValue = getCookie('Authorization');
          axios.delete(`/api/v1/chat/list/room/member/${props.chatringNo}`,{
            headers: {
              'Authorization' : `${myCookieValue}`
            }
            })
          .then(response => {
            alert('방나가기 성공 ');
            props.onCheck(['나가기',props.chatringNo]);
          })
        }
      }
      else if('삭제' == test){
        if(window.confirm('정말 삭제하시겠습니까?')){
          const myCookieValue = getCookie('Authorization');
          axios.delete(`/api/v1/chat/list/room/${props.chatringNo}`,{
            headers: {
              'Authorization' : `${myCookieValue}`
            }
            })
          .then(response => {
            alert('성공적으로 삭제되었습니다');
            props.onCheck(['제거',props.chatringNo]);
          }) 
        }
      }
      else props.onCheck([e.target.textContent,props.chatringNo]);

    }
  return (
    <div className="dropdown" ref={dropdownRef}>
      <div className="dropbtn" onClick={onToggle}>
        <span className="material-symbols-sharp">more_vert</span>
      </div>

      {isOpen && (
        <div className="dropdown-content">
          {/* 시간나면 방장 변경 만들기 */}
          {/* {props.kingNo == props.accountNo ? <a href="#about" onClick={checkOk}>방장 변경</a> : ''} */}
          <a href="#contact" onClick={checkOk}>채팅방 이름 변경</a>
          <a href="#delete" onClick={checkOk}>{props.kingNo == props.accountNo ? '삭제' : '방 나가기'}</a>
        </div>
      )}
    </div>
  );
};

export default DropDown;