import {Link} from 'react-router-dom';
import Header from '../component/header/Header';
import HeaderTop from '../component/headerTop/HeaderTop';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import $ from 'jquery';
import './Main.css';

function Main() {
    useEffect(()=>{
        $('body').addClass('loaded');
    });

  return (
    <div>
        <div className="loader-wrapper">
            <div className="loader"></div>
            <div className="loder-section left-section"></div>
            <div className="loder-section right-section"></div>
        </div>
    
    {/*
        <!--==================================================-->
        <!-- 메인 영상
        <!--==================================================-->
    */}
        <div>
            <div className="slider">
            <div class="bg-video">
            <video className="bg-video__content" autoPlay muted loop style={{height:'100%'}}>
                <source src={require('../../assets/videos/main_title.mp4')} type="video/mp4"/>
            </video>
            </div>
            <div>
                <HeaderTop/>
                <Header/>
            </div>
                <div className="container" style={{marginTop:'400px'}}>
                
                    <div className="row align-items-center">
                        <div className="col-lg-6 col-md-6">
                            <div className="slider-content">
                            <div className="slider-title" style={{width:'1000px'}}>
                                    <h1 className="text-orange" style={{ fontFamily: 'Noto Sans KR, sans-serif',color:'white',fontWeight:'600',textShadow:'10px 10px 10px #000' }}>당신을 위한<br/> 맞춤형 Personal trainer<br/> <span style={{ fontFamily: 'Noto Sans KR, sans-serif',fontWeight:'600',fontSize:'100px'}}>FITME</span></h1>
                                </div>
                                <div className="slider-button">
                                    <a href="/signin">로그인<i className="bi bi-arrow-right"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>  
                    </div>
                </div> 
            </div>
        </div>
  );
}

export default Main;

