import './GameRoomSideProfile.css';
import {useNavigate} from "react-router-dom";
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';


var ipAddress = '192.168.0.53';

//
//이미지서버 연결 
async function imageData(code){
    return await new Promise((resolve,reject)=>{
    try{
        axios.get(`http://192.168.0.53:5050/image/${code}`)
        .then((response)=>{
            console.log(response.data);
            resolve("data:image/png;base64,"+response.data['image']);
        })
    }
    catch(err){reject(err)};
    },2000);
}
//


function GameRoomSideProfile({setShowModal,setShowModal1,imageUrl}){

    const [show, setShow] = useState(false);
    const [show1, setShow1] = useState(false);
    //유저 정보
    const [accountData, setAccount] = useState();
    //네비게이트 훅 사용
	const navigate = useNavigate();
    const [profileImageUrl, setProfileImageUrl] = useState();
    const profile1 = useRef(null);

    //로그인 확인
    useEffect(()=>{
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
          
        const myCookieValue = getCookie('Authorization');
        // console.log('myCookieValue',myCookieValue);
        if(myCookieValue == null){ //로그인 확인
        navigate('/signin');
        }
  
        axios.get(`/api/v1/foodworks/account`, {
            headers: {
            'Authorization' : `${myCookieValue}`,
            'Content-Type' : 'application/json; charset=UTF-8'
            }
        })
        .then(response => {
            const profileData = response.data;
            console.log(profileData)
            if(profileData.accountNo != null) {
                setAccount(profileData);
            };
            //이미지 접속 코드임으로 있을 필요 x
            // if(profileData.image!=null){
            //     imageData(profileData.image).then((imageData)=>{
            //         // setProfileImageUrl(imageData);
            // })
            // }else{
            //     imageData(1).then((imageData)=>{
            //         // setProfileImageUrl(imageData);
            //     });
            // }
        })
    .catch(error => console.log('error',error))
    },[]);
    //

    useEffect(() => {
        // accountNo 상태가 설정되었을 때만 요청을 보냅니다.
        // function profileImage(accountNo){
            if(accountData && accountData.accountNo){
                console.log(accountData);
                // setProfileImageUrl(accountData);
                axios.get(`http://${ipAddress}:5000/chatImage?accountNo=${accountData.accountNo}`)
                    .then(response => {
                        const image_Url = response.data;
                        if (image_Url && image_Url.length > 0) {
                            // 예시로 imageUrl[1]을 사용하나, 실제 필요한 URL 부분을 사용해야 합니다.
                            setProfileImageUrl(image_Url);
                        }
                    })
                    .catch(error => {
                        console.error("프로필 이미지를 불러오는 중 에러 발생:", error);
                    });
            }
    }, [accountData]); 
    
    const newImage =() =>{
        profile1.current.style= "background-image:base;"
        // 이 함수는 필요에 따라 수정이 필요
        // console.log('새 이미지 함수 호출');
    };
    

    const handleClick = () => {
        console.log("클릭");
        setShow(prevShow => !prevShow);
        setShowModal(prevShowModal => !prevShowModal);
    }

    const handleClick1 = () => {
        console.log("클릭");
        setShow1(prevShow => !prevShow);
        setShowModal1(prevShowModal => !prevShowModal);
    }

    return (
        <div className="col-lg-3 col-md-3 game-profile-layout">
            <div className="row">
                <div ref={profile1} onClick={newImage} className='col-lg-10 col-md-10 game-profile'>
                    {imageUrl ? <img src={imageUrl} alt="Profile"/> : profileImageUrl ? <img src={profileImageUrl} alt="Profile"/> : '' }
                    <button className='game-profile-edit-button' onClick={handleClick1}>+</button>
                </div>
                <div className='col-lg-10 col-md-10 game-profile-name'>
                    <div><span>NickName</span><span>조동훈</span></div>
                    <div><span>Playtime</span><span>65:43</span></div>
                    <div><span>Win Rate</span><span>75%</span></div>
                    <div><span>Demo1</span><span></span></div>
                    <div><span>Demo2</span><span></span></div>
                </div>

                <div className='col-lg-10 col-md-10 game-play-button-layout'>
                    <button className="game-play-button" onClick={handleClick}>Game Start</button>
                </div>

            </div>
        </div>
    );
  }
  
  export default GameRoomSideProfile;