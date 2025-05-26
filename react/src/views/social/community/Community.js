import React, {useEffect, useState} from 'react';
import './Community.css';
import axios from 'axios';
import $ from 'jquery';

import Header from '../../component/header/Header';
import HeaderTop from '../../component/headerTop/HeaderTop';
import Modal from './modal';

import Loader from '../../component/loader/Loader';
import CommunityProfile from './component/CommunityProfile';
import CommunityFriendListHeader from './component/CommunityFriendListHeader';
import Breadcumb from '../../component/Breadcumb/Breadcumb';
import CommunityBoard from './crud/CommunityBoard';
import Footer from '../../component/footer/Footer';
import MapBox from './component/MapBox';
import FriendListSideBar from './component/FriendListSideBar';
import CommnunitySearch from './component/CommunitySearch';
import CommunityBoardWriteModal from './crud/CommunityBoardWriteModal';
import CommunityBoardViewModal from './crud/CommunityBoardViewModal';
// import ChatbotFloating from '../../component/chatbotFloating/ChatbotFloating';
import ChatBot from '../../component/chatBot/ChatBot';

import img_community from '../../../assets/images/breadcumb/community.png'


//플로팅
//npm i --save react-floating-action-button

//리액트 모달
//npm install --save react-modal
//import Modal from 'react-modal';


//******************************************************* */
import CommunityBoardWriteModal_ from './crud/CommunityBoardWriteModal_';
import CommunityBoardViewModal_ from './crud/CommunityBoardViewModal_';

function Community() {

    function getCookie(name) {
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
    
    const [boards, setBoards] = useState([]);
    const [loginUser, setLoginUser] = useState([]); //현재 로그인 중인 사용자 정보 저장
    const [userInfo, setUserInfo] = useState([]);
    const [clickedFollower, setClickedFollower] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [accountInfo, setAccountInfo] = useState([]);
    const [onDelete, setOnDelete] = useState(false);
    const [updateBoards, setUpdateBoards] = useState([]);
    const [refresh, setRefresh] = useState(false); //초기화 버튼 상태값
    const [hashTag, setHashtag] = useState(''); //해쉬태그 클릭시 해쉬태그 값 상태값
    

    useEffect(()=>{
        $('body').addClass('loaded');
    });

    //이미지서버 연결 
    async function imageData(code){
        return await new Promise((resolve,reject)=>{
        try{
            axios.get(`http://192.168.0.53:5050/image/${code == null ? 41 : code}`)
            .then((response)=>{
                resolve("data:image/png;base64,"+response.data['image']);
            })
        }
        catch(err){reject(err)};
        },2000);
    }

    // 사용자 정보 프로필 정보 조회
    useEffect(() => {
        axios.get('http://192.168.0.53:8080/api/v1/boards/account', {
          headers: {
            'Authorization' : `${myCookieValue}`,
            'Content-Type' : 'application/json; charset=UTF-8'
          }
        })
        .then(response => { 
            imageData(response.data.image).then((image) => {
                response.data.image = image;
                setUserInfo(response.data);
                setLoginUser(response.data);
            })
        })
        .catch(error => console.log(error))
      }, [onDelete, refresh]);

    // 팔로워 클릭 이벤트 핸들러
    function handleFollowerClick(followerInfo) {
        setClickedFollower(followerInfo);
        setUserInfo(followerInfo);

        axios.get(`http://192.168.0.53:8080/api/v1/boards/friends/${followerInfo.accountNo}`, {
            headers: {
                'Authorization': `${myCookieValue}`,
                'Content-Type': 'application/json; charset=UTF-8'
            }
        })
        .then(async response => {
            setBoards(response.data);
            
            const updatedBoards = await Promise.all(response.data.map(async board => {
                const image = await imageData(board.image);
                board.image = image;
                return board;
            }));
            setBoards(updatedBoards);
        })
        .catch(error => {
            console.error('Error fetching follower boards:', error);
        });
    }


    // 게시글 전체 목록 조회
    useEffect(() => {
        axios.get('http://192.168.0.53:8080/api/v1/boards', {
            headers: {
                'Authorization': `${myCookieValue}`,
                'Content-Type': 'application/json; charset=UTF-8'
            }
        })
        .then(async response => {
            const updatedBoards = await Promise.all(response.data.map(async board => {
                const image = await imageData(board.image);
                board.image = image;
                return board;
            }));
    
            setBoards(updatedBoards);
        })
        .catch(error => console.log(error));
    }, [onDelete, showModal, refresh]);

    //모달창 외부 스크롤 방지
    useEffect(() => {
    if (isOpen) {
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
    } else {
        document.documentElement.style.overflow = 'auto';
        document.body.style.overflow = 'auto';
    }
    return () => {
        document.documentElement.style.overflow = 'auto';
        document.body.style.overflow = 'auto';
    };
    }, [isOpen]);

    //게시글 프로필 클릭 시 사용자 정보 프로필로 출력
    function handleButtonClickedFromChild(accountNo) {
        axios.get(`http://192.168.0.53:8080/api/v1/boards/account/${accountNo}`, {
            headers: {
                'Authorization': `${myCookieValue}`,
                'Content-Type': 'application/json; charset=UTF-8'
            }
        })
        .then(async response => {
            const userInfo = response.data;
            const image = await imageData(userInfo.image);
            userInfo.image = image;
            setUserInfo(userInfo);
        })
        .catch(error => {
            console.error('axios 요청 중 에러 발생:', error);
        });

        axios.get(`http://192.168.0.53:8080/api/v1/boards/friends/${accountNo}`, {
            headers: {
                'Authorization': `${myCookieValue}`,
                'Content-Type': 'application/json; charset=UTF-8'
            }
        })
        .then(async response => {
            setBoards(response.data);
            
            const updatedBoards = await Promise.all(response.data.map(async board => {
                const image = await imageData(board.image);
                board.image = image;
                return board;
            }));
            setBoards(updatedBoards);
        })
        .catch(error => {
            console.error('Error fetching follower boards:', error);
        });
    }

    useEffect(() => {
        setBoards(updateBoards);
    }, [updateBoards]);

  return (
    <div>
        {/* 챗봇용 플로팅 */}
        <ChatBot/>
        {/*헤더 위*/}
        <HeaderTop/>
        {/*헤더 메인 메뉴*/}
        <Header/>
        {/* 로딩 애니메이션*/}
        <Loader/>
        {/* 제목 배경화면 */}
        <Breadcumb title="Community" content="Social" img_title={img_community}/>
        
        {/*게시글 영역*/}
        <div className="blog-area style-two">
            <div className="container">
                <CommunityFriendListHeader handleFollowerClick={handleFollowerClick}/>
                <div className="row">
                    <div className="col-lg-8">
                        {/*게시 혹은 검색 부분*/}
                        <CommnunitySearch 
                            showModal={showModal}
                            setShowModal={setShowModal}
                            setUpdateBoards={setUpdateBoards}
                            hashTag={hashTag}
                            
                        />
                        {/*특정 사용자 프로필 영역*/}
                        <CommunityProfile
                            accountNo={userInfo.accountNo}
                            username={userInfo.username}
                            name={userInfo.name}
                            address={userInfo.address}
                            enrollDate={userInfo.enrollDate}
                            image={userInfo.image}
                            postCount={userInfo.postCount}
                            follower={userInfo.follower}
                            following={userInfo.following}
                            realation={userInfo.realation}
                            loginAccountNo={loginUser.accountNo}
                            refresh={refresh}
                            setRefresh={setRefresh}
                        />
                       
                        {/*게시글 박스*/}
                        {boards.map(board => (
                            <CommunityBoard 
                                key={board.bno}
                                accountNo={board.accountNo}
                                bno={board.bno} 
                                name={board.name}
                                image={board.image}
                                address={board.address}
                                postDate={board.postDate}
                                likes={board.like}
                                title={board.title}
                                comment={board.boardComment}
                                category={board.boardCategory}
                                isOpen={isOpen}
                                setIsOpen={setIsOpen}
                                onButtonClicked={handleButtonClickedFromChild}
                                loginAccountNo={loginUser.accountNo}
                                setOnDelete={setOnDelete}
                                setHashtag={setHashtag}
                            />
                        ))}

                            
                        
                        {showModal && (
                            <CommunityBoardWriteModal_ onClose={() => setShowModal(false)}>
                                <CommunityBoardWriteModal 
                                    accountNo={loginUser.accountNo}
                                    setShowModal={setShowModal}
                                />
                            </CommunityBoardWriteModal_>
                        )}
                        
                    </div>

                    <div className="col-lg-4 col-md-6 col-sm-12">
                        <FriendListSideBar/>
                        <MapBox/>
                    </div>
                </div>
            </div>
        </div>
        {/*푸터 영역*/}
        <Footer/>
        {/* Scroll to top button */}
        <button
            className="scroll-to-top-btn"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
            <i className="fas fa-arrow-up"></i>
        </button>
    </div>
    
  );
}

export default Community;