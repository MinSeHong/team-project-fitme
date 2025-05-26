// React, useEffect 및 useState 훅을 가져오기
import React, { useEffect, useState } from "react";
import './GameRoomProfileModal.css'; // 모달 관련 CSS 파일
import $ from 'jquery';
import { display } from "@mui/system";

import axios from 'axios';
import AI_Image_Loading from "./AI_Image_Loading"; // 이미지 로딩 컴포넌트
import { upload } from "@testing-library/user-event/dist/upload";


var ipAddress = '192.168.0.53';

//쿠기값 받아오는 함수
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

// disableScroll 및 enableScroll 함수 정의
const disableScroll = () => {
  // 스크롤 비활성화를 위한 구현
  document.body.style.overflow = 'hidden';
};

const enableScroll = () => {
  // 스크롤 활성화를 위한 구현
  document.body.style.overflow = 'auto';
};

// Modal 컴포넌트
function GameRoomProfileModal(props) {

  // 상태 관리를 위한 state들
  const [inputText, setInputText] = useState(''); // 사용자 입력 텍스트
  const [imageUrl, setImageUrl] = useState(''); // 생성된 이미지의 URL
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [confirm, setConfirm] = useState(false); // 이미지 생성 후 사용 확인 버튼 상태
  const [accountNo, setAccountNo] = useState(); //유저 어카운트 넘버 변수

  useEffect(() => {
    //로그인 확인 및 어카운트 넘버 가져오기
    const myCookieValue = getCookie('Authorization');

		axios.get(`/api/v1/foodworks/account`, {
		headers: {
			'Authorization' : `${myCookieValue}`,
			'Content-Type' : 'application/json; charset=UTF-8'
		}
		})
		.then(response => {
			var proflieData = response.data;
			// console.log('proflieData',proflieData.accountNo);
      setAccountNo(proflieData.accountNo);
		})
		.catch(error => console.log('error',error))

    disableScroll(); // 모달이 열릴 때 스크롤 비활성화
    return () => enableScroll(); // 컴포넌트가 언마운트 될 때(modal 닫히면) 스크롤 활성화
  }, []);

  // 모달 닫기 함수
  function closeModal() {
    props.onClose();
  }
  // 이미지 생성 취소 함수
  const editCancel = (e) =>{
    $(e.target.parentElement.parentElement.parentElement).find(".ai-image-create").fadeToggle();
  }
  // 이미지 생성 팝업 표시 함수
  const editPopup = (e) =>{
    $(e.target.parentElement.parentElement).find(".ai-image-create").fadeIn();
  }

  // 이미지 생성 및 서버에 저장 함수
  const createImage = async (e) => {
    try{
      $(e.target.parentElement.parentElement.parentElement).find(".ai-image-create").fadeToggle();
      setLoading(true); //로딩 시작

      //POST 요청 Flask 서버에 이미지 생성 요청
      const res = await axios.post(`http://${ipAddress}:5000/chatImage`, { message: inputText,'accountNo' : accountNo});
      console.log('resres',res); //이아래 일련번호 및 이미지 전부 메인에서
        //응답에서 base64 인코딩된 이미지 데이터를 가져와 state에 저장
        setImageUrl(`data:image/png;base64,${res.data.image_data}`);
        setConfirm(true);
        // FormData 객체 생성 및 이미지 데이터 추가
        // const imagedata=new FormData();
        // imagedata.append('uploads',res.data.image_data)
        // // 이미지 서버에 이미지 데이터 업로드 요청 후, 업로드된 이미지 정보를 Flask 서버로 전송
        // axios.post(`http://192.168.0.53:5050/file/uploads`,imagedata)
        // .then((response)=>{
        //   console.log(accountNo,':',response.data);//어카운트 : 이미지 일련번호 //[2161] 결과 값 (문제 3)
        //   const formData = new FormData();
        //   formData.append('accountNo',accountNo);
        //   formData.append('imageUrl',response.data);
        //   // const uploadInfo ={
        //   //   accountNo : accountNo,           //여기에 어카운트도 같이 보내주시면 좋습니다 
        //   //   imageUrl : response.data, // 업로드된 이미지 URL //일단 url존재 X
        //   // };
        //   return axios.post(`http://${ipAddress}:5000/chatImage`,formData,{
        //     headers: {
        //     'Content-Type': 'multipart/form-data',
        //     },
        //   });
        //   })
        //   .then((response)=>{
        //     // flask 서버 응답 확인
        //     console.log("이미지 정보 전송 성공:",response.data);
        //   })
        //   .catch((error)=>{
        //     console.error("이미지 업로드 또는 정보 전송 중 오류 발생:",error);
        //   });

    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false); //로딩 종료
    }

  };
  // 이미지 사용 확인 함수
  function checkUrl(){
    props.onConfirm(imageUrl); // 부모 컴포넌트(game.js)에 imageUrl을 onConfirm 이벤트로 전송
    closeModal();
  }

  return (
    <div className="Modal" onMouseDown={closeModal}>
      <div className="modalBody" onMouseDown={(e) => e.stopPropagation()} style={{width: '512px', height: '512px', overflow:"hidden", backgroundColor:"rgb(255, 255, 255)"}}>
        <div className="ai-image-create" style={{display:"none", boxShadow:"0px 0px 5px 1px rgba(0,0,0,0.3)"}}>
          <input className="ai-image-input" placeholder="생성할 이미지를 입력하세요"
          onChange={(e) => setInputText(e.target.value)}  // 입력된 텍스트를 state에 저장
          ></input>
          <div className="game-profile-modal-edit-button-ai-layout">
            <button className="game-profile-modal-edit-button-ai" onClick={createImage}>Create</button>
            <button className="game-profile-modal-edit-button-ai" onClick={editCancel}>Cancel</button>
          </div>
        </div>
       
        <div className="game-profile-edit-image-layout" style={{border:"1px solid rgba(0,0,0,0.2)"}}>
          {/*게임 프로필 이미지 생성 부분 */}
          {imageUrl && <img src={imageUrl} alt=""/>}
        </div>

        <div className="game-profile-edit-button-layout" style={{border:"1px solid rgba(0,0,0,0.2)"}}>
          {/* <label htmlFor="file" className='game-profile-modal-edit-button label-line-height'>Images</label> */}
          <input type="file" id="file" style={{ display: "none" }}/>

          {/*게임 프로필 이미지 사용자가 가져오는 부분 */}
          <button className="game-profile-modal-edit-button" onClick={editPopup}>Ai Image</button>
          
          {/*게임 프로필 생성 확인 */}
          {confirm && (
            <button className="game-profile-modal-edit-button" onClick={checkUrl}>이미지 사용하기</button>
          )}
          
          {/*게임 프로필 AI가 생성하는 버튼 */}
        </div>

        <button onMouseDown={closeModal} style={{position:"absolute", width:"30px" ,right:"5px", top:"5px", border:"1px solid gray", backgroundColor:"white", borderRadius:"5px", zIndex:"2"}}>
          ✖
        </button>

        {loading && (
        <AI_Image_Loading>
        </AI_Image_Loading>
        )}

      </div>
      
    </div>
  );
}

export default GameRoomProfileModal;