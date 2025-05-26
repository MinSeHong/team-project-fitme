import {Link} from 'react-router-dom';

import React, { useEffect, useLayoutEffect, useState } from 'react';

import axios from "axios";

import Breadcumb from '../component/Breadcumb/Breadcumb';
import Loader from '../component/loader/Loader';
import Header from '../component/header/Header';
import HeaderTop from '../component/headerTop/HeaderTop';
import $ from 'jquery';
import Wrapper from '../component/Wrapper/Wrapper';

import GameRoomSearch from './component/GameRoomSearch';
import './Game.css';

import GameRoomContainer from './component/GameRoomContainer';

import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';


import styled from "styled-components";
import GameRoomMakeModal from './component/GameRoomMakeModal';
import GameRoomProfileModal from './component/GameRoomProfileModal';
import GameRoomSideProfile from './component/GameRoomSideProfile';


var ipAddress = '192.168.0.53';

function Game() {
    const options = {
      animateOut: 'slideOutUp',
      animateIn: 'slideInUp',
      margin:10,
      loop: true,
      items: 1,
      dots:false,
      autoplay:true,
      autoplayTimeout: 4500,
      smartSpeed: 4000,
      mouseDrag: false
    };

    const [showModal, setShowModal] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const [showModal1, setShowModal1] = useState(false);
    const [isOpen1, setIsOpen1] = useState(false);

    //방 리스트
    const [roomList,setRoomList] = useState([]);

    // const [imageUrl, setImageUrl] = useState(null);
    const [imageUrl, setImage] = useState();

    // 사용자의 계정 번호저장
    const [accountNo, setAccountNo] = useState(null);

    //잠시만 확인용 함수 만들겠습니다
    function setImageUrl(e){
      // console.log('setImageUrl',e); //데이타 들어오는거 확인
      //받아온 이미지를 GameRoomSide로 데이터 전송을 위한 변수 선언
      setImage(e);
    }

    useEffect(()=>{
        $('body').addClass('loaded');
      axios.get('/api/v1/gameRooms')
      .then(res=>{
        // console.log('세션버전',(res.data).length);
        setRoomList(res.data);
      })

    },[]);

    const Refreshbutton = () => {
      {/*로딩 애니메이션 시작 부분*/}
      $(".refresh").addClass('loading');

      
      {/*  */}
      axios.get('/api/v1/gameRooms')
      .then(res=>{
        // console.log('세션버전',(res.data).length);
        setRoomList(res.data);
      })

      {/*로딩 애니메이션 완료 부분*/}
      $(".refresh").removeClass('loading');
    }

  return (
    <div>
        {/*헤더 위*/}
        <HeaderTop/>
        {/*헤더 메인 메뉴*/}
        <Header/>
        {/* 로딩 애니메이션*/}
        <Loader/>

        <div className="blog-area style-two game-background-style">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 col-md-12">
                <div className="row">
                  <div className="col-lg-8 col-md-8 game-notice-layout" style={{marginRight:"50px"}}>
                      <div className='notice-box'>
                        {/**************************************************************/}
                        {/*게임 공지사항, 알람 목록*/}
                        <OwlCarousel {...options} className='notice-box-item'>
                          <div> <i className='fas fa-bell'></i> [공지사항] 2023년 07월 23일. 게임 업데이트 관련 안내</div>
                          <div> <i className='far fa-comment-dots'></i> ㅇㅇㅇ님이 랭킹 게임에서 35 Points를 얻었습니다.</div>
                          <div> <i className='far fa-comment-dots'></i> ㅇㅇㅇㅇ님이 랭킹 게임에서 65 Points를 얻었습니다.</div>
                        </OwlCarousel> 
                        {/**************************************************************/}
                      </div>
                    
                  </div>

                  <div className="col-lg-8 col-md-8 game-layout" style={{marginRight:"50px"}}>
                    <div className="row">
                      <div className='col-lg-11 col-md-11'>
                        {/**************************************************************/}
                        {/*게임방 검색 기능 영역 (게임방 검색 기능)*/}
                        <GameRoomSearch/>
                        {/**************************************************************/}
                      </div>

                      <div className='col-lg-11 col-md-11 game-room-layout'>
                        {/**************************************************************/}
                        {/*게임방 목록 영역 (대기실 목록)*/}
                        {Object.entries(roomList).map(([roomId, roomData])=>(
                          <ul>
                            {roomData.map((item) => (
                              <GameRoomContainer data={item}/>
                            ))}
                          </ul>
                        ))}
                        {/* <GameRoomContainer/>
                        <GameRoomContainer/>
                        <GameRoomContainer/>
                        <GameRoomContainer/>
                        <GameRoomContainer/>
                        <GameRoomContainer/>
                        <GameRoomContainer/> */}
                        {/**************************************************************/}
                      </div>
                      {/* 새로고침 버튼 */}
                      <button className="refresh" onClick={Refreshbutton}>
                        	<svg className="icon" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="m23.8995816 10.3992354c0 .1000066-.1004184.1000066-.1004184.2000132 0 0 0 .1000066-.1004184.1000066-.1004184.1000066-.2008369.2000132-.3012553.2000132-.1004184.1000066-.3012552.1000066-.4016736.1000066h-6.0251046c-.6025105 0-1.0041841-.4000264-1.0041841-1.00006592 0-.60003954.4016736-1.00006591 1.0041841-1.00006591h3.5146443l-2.8117154-2.60017136c-.9037657-.90005932-1.9079498-1.50009886-3.0125523-1.90012523-2.0083682-.70004614-4.2175733-.60003954-6.12552305.30001977-2.0083682.90005932-3.41422594 2.50016478-4.11715481 4.5002966-.20083682.50003295-.80334728.80005275-1.30543933.60003954-.50209205-.10000659-.80334728-.70004613-.60251046-1.20007909.90376569-2.60017136 2.71129707-4.60030318 5.12133891-5.70037568 2.41004184-1.20007909 5.12133894-1.30008569 7.63179914-.40002637 1.4058578.50003296 2.7112971 1.30008569 3.7154812 2.40015819l3.0125523 2.70017795v-3.70024386c0-.60003955.4016736-1.00006591 1.0041841-1.00006591s1.0041841.40002636 1.0041841 1.00006591v6.00039545.10000662c0 .1000066 0 .2000132-.1004184.3000197zm-3.1129707 3.7002439c-.5020921-.2000132-1.1046025.1000066-1.3054394.6000396-.4016736 1.1000725-1.0041841 2.200145-1.9079497 3.0001977-1.4058578 1.5000989-3.5146444 2.3001516-5.623431 2.3001516-2.10878662 0-4.11715482-.8000527-5.72384938-2.4001582l-2.81171548-2.6001714h3.51464435c.60251046 0 1.0041841-.4000263 1.0041841-1.0000659 0-.6000395-.40167364-1.0000659-1.0041841-1.0000659h-6.0251046c-.10041841 0-.10041841 0-.20083682 0s-.10041841 0-.20083682 0c0 0-.10041841 0-.10041841.1000066-.10041841 0-.20083682.1000066-.20083682.2000132s0 .1000066-.10041841.1000066c0 .1000066-.10041841.1000066-.10041841.2000132v.2000131.1000066 6.0003955c0 .6000395.40167364 1.0000659 1.0041841 1.0000659s1.0041841-.4000264 1.0041841-1.0000659v-3.7002439l2.91213389 2.8001846c1.80753138 2.0001318 4.31799163 3.0001977 7.02928871 3.0001977 2.7112971 0 5.2217573-1.0000659 7.1297071-2.9001911 1.0041841-1.0000659 1.9079498-2.3001516 2.4100418-3.7002439.1004185-.6000395-.2008368-1.2000791-.7029288-1.3000857z" transform=""/></svg>
                      </button>
                    </div>
                  </div>
                  
                  {/**************************************************************/}
                  {/*게임 프로필 영역 (오른쪽 사이드바)*/}
                  <GameRoomSideProfile showModal={showModal} setShowModal={setShowModal} showModal1={showModal1} setShowModal1={setShowModal1} imageUrl={imageUrl}/>
                  {/* 이동 확인용 */}
                  {/* <GameRoomSideProfile showModal={showModal} setShowModal={setShowModal} showModal1={showModal1} setShowModal1={setShowModal1}/> */}
                  {/**************************************************************/}
                </div>
              </div>
            </div>
          </div>
        </div>


        {/**** 게임방 생성 모달 *****/}
        {showModal && (
        <GameRoomMakeModal open={isOpen} onClose={() => {setShowModal(false);}}>
        </GameRoomMakeModal>
        )}

        {showModal1 && (
          // onConfirm의 값을 setImageUrl함수로 이동
        <GameRoomProfileModal onConfirm={setImageUrl} open={isOpen1} onClose={() => {setShowModal1(false);}}>
        </GameRoomProfileModal>
        )}

        {/**** 푸터 영역 *****/}
        <div className="footer_section">
          <div className="container">
            <div className="row">
              <div className="col-lg-3 col-md-6">
                <div className="single-footer-box">
                  <div className="footer-logo">
                    <img src="assets/images/logo-2.png" alt=""/>
                  </div>
                  <div className="footer-content">
                    <div className="footer-title">
                      <p>There are many variation of passa Morem Ipsum available, but the in majority have suffered.</p>
                      <h5>Follow Us:</h5>
                    </div>
                    <div className="footer-icon">
                      <ul>
                        <li><a href="#"><i className="fab fa-facebook-f"></i></a></li>
                        <li><a href="#"><i className="fab fa-twitter"></i></a></li>	
                        <li><a href="#"><i className="fab fa-behance"></i></a></li>
                        <li><a href="#"><i className="fab fa-linkedin-in"></i></a></li>	
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="single-footer-box">
                  <div className="footer-content">
                    <div className="footer-title">
                      <h2>Company Info:</h2>
                    </div>
                    <div className="footer-ico">
                      <ul>
                        <li><a href="#"><i className="fas fa-check"></i><span>Our Projects</span></a></li>
                        <li><a href="#"><i className="fas fa-check"></i><span>About Us</span></a></li>
                        <li><a href="#"><i className="fas fa-check"></i><span>Upcoming Events</span></a></li>
                        <li><a href="#"><i className="fas fa-check"></i><span>Upcoming Events</span></a></li>
                        <li><a href="#"><i className="fas fa-check"></i><span>Our Services</span></a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="single-footer-box">
                  <div className="footer-content">
                    <div className="footer-title">
                      <h2>Company Info:</h2>
                    </div>
                    <div className="footer-icons">
                      <i className="fa fa-home"></i>
                      <p><b>Address</b> <br/> 10 South Building, Dhaka</p>
                    </div>
                    <div className="footer-icons">
                      <i className="fa fa-phone"></i>
                      <p><b>Telephone</b> <br/> (922) 3354 2252</p>
                    </div>
                    <div className="footer-icons">
                      <i className="fa fa-globe"></i>
                      <p><b>Email:</b> <br/> example@gmail.com</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="single-footer-box">
                  <div className="footer-content">
                    <div className="footer-title">
                      <h2>Company Info:</h2>
                      <p>There are many variation of passa Morem Ipsum available.</p>
                    </div>
                    <form action="https://formspree.io/f/myyleorq" method="POST" id="dreamit-form">
                      <div className="row">
                        <div className="col-lg-12 col-md-12">
                          <div className="form_box">
                            <input type="text" name="youe email address" placeholder="youe email address"/>
                          </div>
                        </div>
                        <div className="form-button">
                          <button type="submit">sign up</button>
                        </div>
                      </div>
                    </form>
                    <div id="status"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row footer-bottom">
              <div className="col-lg-6 col-md-6">
                <div className="copy-left-box">
                  <div className="copy-left-title">
                    <h3>Copyright © Agrofarm all rights reserved.</h3>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="copy-right-box">
                  <div className="copy-right-title">
                    <ul>
                      <li><a href="#"><span>Terms & Condition</span></a></li>
                      <li><a href="#"><span>Privacy Policy</span></a></li>
                      <li><a href="#"><span>Contact Us</span></a></li>
                    </ul>															
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}

export default Game;