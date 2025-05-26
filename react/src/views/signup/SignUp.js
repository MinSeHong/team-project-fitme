import {Link} from 'react-router-dom';
import React, { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './Register.css';

import DaumPost from './DaumPost';  // DaumPost 컴포넌트
import Header from '../component/header/Header';
import HeaderTop from '../component/headerTop/HeaderTop';
import Breadcumb from '../component/Breadcumb/Breadcumb';
import Chatbot from '../component/chatBot/ChatBot';

import swal from 'sweetalert2';

import img_login from '../../assets/images/breadcumb/login.jpg';

const emailRegex = '[a-zA-Z0-9]+@[a-zA-Z0-9]+\\.[a-zA-Z]{2,}';
const passwordRegex = '^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,12}$';
const pnumRegex = '^\\d{11}$';

function SignUp() {
  const [password, setPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [genderMessage, setGenderMessage] = useState('');
  const [interMessage, setInterMessage] = useState('');
  const [postcode, setPostcode] = useState('');
  const [address, setAddress] = useState('');  
  const navigate = useNavigate();
  const formData = new FormData();
  const [userEmail, setUserEmail] = useState('');
  const [emailCode, setemailCodeCode] = useState('');
  const [emailCodeMatch, setEmailCodeMatch] = useState(true);
  const [emailInput, setEmailInput] = useState('');
  const [visible, setVisible] = useState(false);
  
  const [showVerification, setShowVerification] = useState(false); // 추가


  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };  
  let addressChk = 0;
  
  const handleOpenDaumPost = () => {
    addressChk = 1;
    setVisible(true);
  };

  const handleAddressChange = (postcode, address) => {
    setPostcode(postcode);
    setAddress(address);
    // 주소를 선택한 후 DaumPost 컴포넌트를 닫습니다.
    addressChk = 0;
    setVisible(false);
  };

  const handleEmailCode = () => {
    axios.get(`/mailCheck?email=${userEmail}`)
      .then(response => {
        console.log('응답:', response.data);
        setemailCodeCode(response.data);
        swal.fire({
          icon: "info",
          title: "인증 코드가 전송되었습니다."
        });
        setShowVerification(true); // 인증 코드 입력 칸을 보이도록 설정
      })
      .catch(error => {
        console.error('에러:', error);
        swal.fire({
          icon: "error",
          title: "인증 코드 전송에 실패했습니다.",
          text: "이메일을 확인해 주세요",
          footer: '오류가 계속될 경우 관리자에게 문의해 주세요'
        });
        setShowVerification(false); // 인증 코드 입력 칸 감추기
      });
  };
  const handleCodeCheck = () => {
    if (emailInput == emailCode) {      
      setEmailCodeMatch(true);
      swal.fire({
        icon: "success",
        title: "인증 코드가 일치합니다!"
      });   
    } else {     
      setEmailCodeMatch(false);
      swal.fire({
        icon: "warning",
        title: "인증 코드가 일치하지 않습니다. 다시 시도해주세요."
      });
    }
  };

  const handleInputChange = (e) => {
    setEmailInput(e.target.value);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    console.log('addressChk',addressChk)
    if(addressChk === 1) return;
    //유효성 체크

    if(e.target.name.value.length == 0){swal.fire({
      title: "잠시만요!",
      text: "이름을 입력해주세요",
      icon: "warning"
      }).then(() => {
      setTimeout(() => {
        const nameInput = document.getElementsByName('name')[0];
        if (nameInput) {
          nameInput.focus();
        }
      }, 500); // 적절한 시간 지연(ms) 설정
    });
    return;}

    if(e.target.email.value.length == 0) 
    {swal.fire({
      title: "잠시만요!",
      text: "이메일을 입력해주세요",
      icon: "warning"
    }).then(() => {
      setTimeout(() => {
        const nameInput = document.getElementsByName('email')[0];
        if (nameInput) {
          nameInput.focus();
        }
      }, 500); // 적절한 시간 지연(ms) 설정
    }); 
    return;}

    if(e.target.password.value.length == 0) 
    {swal.fire({
      title: "잠시만요!",
      text: "비밀번호를 입력해주세요",
      icon: "warning"
    }).then(() => {
      setTimeout(() => {
        const nameInput = document.getElementsByName('password')[0];
        if (nameInput) {
          nameInput.focus();
        }
      }, 500); // 적절한 시간 지연(ms) 설정
    }); 
    return;}


    if(e.target.passwordchk.value !== e.target.password.value) 
    {swal.fire({
      title: "잠시만요!",
      text: "입력한 비밀번호를 확인해주세요",
      icon: "warning"
    }).then(() => {
      setTimeout(() => {
        const nameInput = document.getElementsByName('passwordchk')[0];
        if (nameInput) {
          nameInput.focus();
        }
      }, 500); // 적절한 시간 지연(ms) 설정
    }); 
    return;}


    if(e.target.height.value.length == 0) 
    {swal.fire({
      title: "잠시만요!",
      text: "키를 입력해주세요",
      icon: "warning"
    }).then(() => {
      setTimeout(() => {
        const nameInput = document.getElementsByName('height')[0];
        if (nameInput) {
          nameInput.focus();
        }
      }, 500); // 적절한 시간 지연(ms) 설정
    }); 
    return;}

    if(e.target.weight.value.length == 0) 
    {swal.fire({
      title: "잠시만요!",
      text: "몸무게를 입력해주세요",
      icon: "warning"
    }).then(() => {
      setTimeout(() => {
        const nameInput = document.getElementsByName('weight')[0];
        if (nameInput) {
          nameInput.focus();
        }
      }, 500); // 적절한 시간 지연(ms) 설정
    }); 
    return;}

    if(e.target.children.birth.children[0].children[0].value.length == 0) 
    {swal.fire({
      title: "잠시만요!",
      text: "생년월일을 입력해주세요",
      icon: "warning"
    }).then(() => {
      setTimeout(() => {
        const nameInput = document.getElementsByName('year')[0];
        if (nameInput) {
          nameInput.focus();
        }
      }, 500); // 적절한 시간 지연(ms) 설정
    }); 
    return;}

    if(e.target.address.value.length == 0) 
    {swal.fire({
      title: "잠시만요!",
      text: "주소를 입력해주세요",
      icon: "warning"
    }).then(() => {
      setTimeout(() => {
        const nameInput = document.getElementsByName('detailaddress')[0];
        if (nameInput) {
          nameInput.focus();
        }
      }, 500); // 적절한 시간 지연(ms) 설정
    }); 
    return;}

    if(document.querySelector('input[name="gender"]:checked') == null) 
    {swal.fire({
      title: "잠시만요!",
      text: "성별을 선택해주세요",
      icon: "warning"
    }); 
    return;}

    if(document.querySelector('input[name="inter"]:checked') == null) 
    {swal.fire({
      title: "잠시만요!",
      text: "관심사를 선택해주세요",
      icon: "warning"
    }); 
    return;}
    
    const currentYear = new Date().getFullYear();
    const year = e.target.children.birth.children[0].children[0].value
    // console.log(currentYear - year + 1); //이거 왜 생일이 아니라 나이임?
    // console.log('address',address,e.target.detailaddress.value);
    // console.log(document.querySelector('input[name="gender"]:checked').id=='select_m' ? 'm' : 'w' );
    console.log(document.querySelector('input[name="inter"]:checked') == null);

     // const year = e.target.year.value;
    // 
    const age = currentYear - year + 1;
    const gender = document.querySelector('input[name="gender"]:checked').id=='select_m' ? 'M' : 'W';
    const inter = document.querySelector('input[name="inter"]:checked').id=='select_d' ? 'D' : 'W';

    // var child = e.target.children;
    //보낼 값
    formData.append('name', e.target.name.value);
    formData.append('username', e.target.email.value);
    formData.append('password', e.target.password.value);    
    formData.append('height', e.target.height.value);
    formData.append('weight', e.target.weight.value);    
    formData.append('address', address+' '+e.target.detailaddress.value);
    formData.append('age', age);
    formData.append('gender', gender);
    formData.append('hobby', inter);

    axios.post(`/joinMember`, formData, {
      // axios.post(`http://192.168.0.118:3000/joinMember`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        {swal.fire({
          title: "회원가입 성공",
          icon: "success",
        });}
        navigate('/signin');
      })
      .catch((error) => {
        console.error('서버 오류:', error);
        {swal.fire({
          title: "오류",
          text: "관리자에게 문의해 주세요",
          icon: "error",
        });}
      });
    
   // 성별 선택 확인
   const genderSelected = document.querySelector('input[name="gender"]:checked');
   if (!genderSelected) {
     setGenderMessage('성별을 선택하세요.');
     return;
   } else {
     setGenderMessage('');
   }

     // 관심사 선택 확인
     const interSelected = document.querySelector('input[name="inter"]:checked');

     if (!interSelected) {
       setInterMessage('관심사를 선택하세요.');
       return;
     } else {
       setInterMessage('');
     }

    // 비밀번호 확인
    const passwordChk = formData.get('passwordchk');

    if (password !== passwordChk) {
      setPasswordMatch(false);
      return;
    } else {
      setPasswordMatch(true);
    }

    // FormData 확인
    for (var pair of formData.entries()) {
      console.log(pair[0] + ', ' + pair[1]);
    }
    
  };

  return (
    <div style={{paddingBottom:"80px"}}>
        <HeaderTop/>
        <Header/>

        {/* 배경화면 */}
        <Breadcumb title="Signup" content="Account" img_title={img_login}/>

         <form className="login-form" onSubmit={handleRegister} method='post' style={{marginTop:"100px"}}>
        <h1 className="login-heading">회원 가입</h1>
        <h3 className="login-heading">다양한 서비스를 즐겨보세요!</h3>
        <br />
        <input type="text" name="name" className="text-field" placeholder="이름" />
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
                  type='button'  // 자동으로 submit 되는걸 방지                  
                  >인증
          </button>
        </div>

      {showVerification && (
        <div id="info__email">
              <input
              type="text"
              id="emailCodeInput"
              className="mail-check-input"
              placeholder="인증번호 입력"
              value={emailInput}
              onChange={handleInputChange}
              />
              <button
                id="mail-Check-submit"
                className="verification-button"
                onClick={handleCodeCheck}    
                type='button'  // 자동으로 submit 되는걸 방지     
              >
                확인
              </button>
        </div>
      )}

        <input
          type="password"
          name="password"
          pattern={passwordRegex}
          title="8~12자 & 숫자,영어,특수문자가 포함되어야 합니다."
          className="text-field"
          placeholder="비밀번호"
          value={password}
          onChange={handlePasswordChange}
        />
        <input type="password" name="passwordchk" className="text-field" placeholder="비밀번호 확인" />
        {!passwordMatch && (
          <p style={{ color: 'red', fontSize: '14px', marginTop: '-10px' }}>비밀번호가 일치하지 않습니다.</p>
        )}
        <input type="text" name="height" className="text-field" placeholder="키" />
        <input type="text" name="weight" className="text-field" placeholder="몸무게" />
       
        <div className="info" id="info__birth" name='birth'>
          <div>
          <input type="number" min="1900" max="2500" name="year" className="year" placeholder="년도(4자리)" />
          <select className="month">
              <option value="">월</option>
              <option value="">1월</option>
              <option value="">2월</option>
              <option value="">3월</option>
              <option value="">4월</option>
              <option value="">5월</option>
              <option value="">6월</option>
              <option value="">7월</option>
              <option value="">8월</option>
              <option value="">9월</option>
              <option value="">10월</option>
              <option value="">11월</option>
              <option value="">12월</option>
            </select>
            <input type="number" min="1" max="31" className="day" placeholder="일" />
          </div>
        </div>
        <div id="find_adress">
        <input type="text" id="postcode" name="postcode" placeholder="우편번호" value={postcode} readOnly />
        <button className="searchaddress-button" onClick={handleOpenDaumPost} type='button'  > {/*자동으로 submit 되는걸 방지*/}
          주소 검색
        </button>
        {visible ? <DaumPost handleAddressChange={handleAddressChange} setVisible={setVisible} /> : null}
      </div>
          <input type="text"  id="address" name="address" placeholder="주소" value={address} readOnly/> 
          <input type="text" id="detailAddress" name="detailaddress" placeholder="상세주소"/>
        <div className="hr-sect">선택해주세요!</div>
        <div className="section-heading">성별</div>
        <div className="select_gender">
        <input type="radio" id="select_m" name="gender" />
          <label htmlFor="select_m">남성</label>
          <input type="radio" id="select_f" name="gender" />
          <label htmlFor="select_f">여성</label>
          {genderMessage && (
            <p style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{genderMessage}</p>
          )}
        </div>
        <div className="section-heading">관심사</div>
        <div className="select_inter">
          <input type="radio" id="select_d" name="inter" />
          <label htmlFor="select_d">식단</label>
          <input type="radio" id="select_w" name="inter" />
          <label htmlFor="select_w">운동</label>
          {interMessage && (
            <p style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{interMessage}</p>
          )}
        </div>
        <input type="submit" value="회원 가입" className="submit-btn" />
        <div className="links">
          <p>
            이미 계정이 있으신가요? <a href="/signin">로그인</a>
          </p>
        </div>
        <p className="agree">
          <span>
            회원 가입 시, FitMe의 <a href="#" target="_blank">이용 약관</a> 및
            <br />
            개인정보 처리 방침에 동의했습니다. <a href="#" target="_blank">개인정보 처리 방침</a>
          </span>
        </p>
      </form>
      <Chatbot/>
    </div>
  );
}

export default SignUp;