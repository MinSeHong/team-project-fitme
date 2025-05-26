import {Link} from 'react-router-dom';
import React, { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import '../signup/Register.css';
import './findPassword.css'

import Header from '../component/header/Header';
import HeaderTop from '../component/headerTop/HeaderTop';
import Breadcumb from '../component/Breadcumb/Breadcumb';

import img_login from '../../assets/images/breadcumb/login.jpg';

const emailRegex = '[a-zA-Z0-9]+@[a-zA-Z0-9]+\\.[a-zA-Z]{2,}';
const passwordRegex = '^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,12}$';


function FindPassword() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  const [emailCode, setemailCodeCode] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [emailButtonDisabled, setemailButtonDisabled] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [emailCodeMatch, setEmailCodeMatch] = useState(false);

  const handlePasswordChange = (e) => {
    // setPassword(e.target.value);
    e.preventDefault();

    // 이메일 입력 값 가져오기
    const userEmail = e.target.email.value;

    // 새 비밀번호 입력 값 가져오기
    const newPassword = e.target.passwordchk.value;

    // 이메일과 새 비밀번호가 비어 있는지 확인
    if (!userEmail || !newPassword) {
        alert('이메일과 새 비밀번호를 모두 입력해주세요.');
        return;
    }

    // 서버로 전송할 데이터
    const requestData = {
        username: userEmail,       
        newPassword: newPassword
    };

    // 서버로 데이터 전송
    axios.post('/updatepwd', requestData) 
      .then(response => {          
          console.log(response.data);
          alert('비밀번호가 성공적으로 변경되었습니다.');          
      })
      .catch(error => {         
          console.error('에러:', error.response.data);
          alert('비밀번호 변경에 실패했습니다. 재시도해주세요.');
      });
  };  


  const handleEmailCode = (e) => {
    axios.get(`/mailCheck?email=${userEmail}`)
      .then(response => {
        console.log('응답:', response.data);
        setemailCodeCode(response.data);
        alert('인증 코드가 전송되었습니다.');
      })
      .catch(error => {
        console.error('에러:', error);
        alert('인증 코드 전송에 실패했습니다.');
      });
  };
  const handleCodeCheck = () => {
    if (emailInput == emailCode) {      
      setEmailCodeMatch(true);
      alert('인증 코드가 일치합니다!');      
    } else {  
      alert('인증 코드가 일치하지 않습니다. 다시 시도해주세요.');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    //유효성 체크
    if(e.target.email.value.length == 0) {alert('이메일을 입력하세요'); return;}
    return;
  };

  return (
    <div style={{paddingBottom:"80px"}}>
        <HeaderTop/>
        <Header/>

        {/* 제목 배경화면 */}
        <Breadcumb title="FindPassword" content="Account" img_title={img_login} />



        <form className="login-form" onSubmit={handleRegister} method='post' style={{marginTop:"100px"}}>
        <h2 className="login-heading">비밀번호 찾기</h2>
        <h5 className="login-heading">이메일 인증 후 비밀번호를 찾으세요.</h5>
        <br />  
        <div id="info__email">
          <input
            type="text"
            name="email"
            pattern={emailRegex}
            title="이메일 형식으로 입력하세요."
            className="text-field"
            placeholder="이메일"
            value={userEmail}
            onChange={e => setUserEmail(e.target.value)}
          />

          <button id="mail-Check-Btn" 
                  className="verification-button" 
                  onClick={handleEmailCode}
                  disabled={emailButtonDisabled}
                  >인증
          </button>
        </div>

        <div style={{ position: 'relative' }}>
          <input
            type="text"            
            value={emailInput}
            id="emailCodeInput"
            className="mail-check-input"
            onChange={e => setEmailInput(e.target.value)}            
            placeholder="인증번호 입력"
          />
          <button
            id="mail-Check-submit"

            className="verification-button-submit mcs"
            onClick={handleCodeCheck} 
            style={{ position: 'absolute', right:'20px', top: '25%', transform: 'translateY(-50%)' }}

          >
            확인
          </button>
        </div>
        <div style={{ position: 'relative' }}>
          <input
            type="password" 
            name="passwordchk" 
            className="text-field" 
            placeholder="비밀번호 수정" 
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
          />        
          <button 
            id="password-Check-submit" 
            className="verification-button-submit pcs"

            style={{ position: 'absolute', right:'20px', top: '25%', transform: 'translateY(-50%)',
            display: emailCodeMatch ? 'block' : 'none' }} 

            > 수정 
          </button>         
        </div>
       
        
        <div className=" hs"></div>
                
        <input type="submit" value="확인" className="submit-btn subtn" />
        <div className="links">
          <p>
            비밀번호를 기억하셧나요? <a href="/signin">로그인</a>
          </p>
        </div>
        <p className="agree">
          <span>
            회원 가입 시, FitMe의 <a href="#" target="_blank">이용 약관</a> 및
            <br />
            개인정보 처리 방침에 동의했습니다.<br/> <a href="#" target="_blank">개인정보 처리 방침</a>
          </span>
        </p>
      </form>
    </div>
  );
}
export default FindPassword