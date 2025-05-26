import {Link} from 'react-router-dom';
import { useEffect, useState } from 'react';
import './MyPageSidebar.css';
import $, { event } from 'jquery'



//datepicker사용
//npm install @mui/x-date-pickers
//npm install @mui/material @emotion/react @emotion/styled
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

//npm install dayjs
import dayjs from 'dayjs';
import moment from "moment";

function MyPageSidebar({accountData,week,Scroll_Profile, Scroll_Inbody, Scroll_Statistic_Diet, Scroll_Statistic_Workout, Scroll_BulletinBoard, Scroll_Youtube}) {

    console.log('accountData',accountData);

    const MenuSlide = (e) =>{
        if($(e.target.parentElement).hasClass("sidebar-dropdown") && !$(e.target.parentElement).hasClass("active")){
            $(".sidebar-dropdown").removeClass("active");
            $(e.target.parentElement).addClass("active");
            $(".sidebar-submenu").slideUp();
            $(e.target.parentElement).find(".sidebar-submenu").slideDown();
        }
    }

    $("#close-sidebar").on("click", function () {
        $(".page-wrapper").removeClass("toggled");
        $(".page-wrapper").css("width", "0px");
    });

    $("#show-sidebar").on("click", function () {
        $(".page-wrapper").addClass("toggled");
        $(".page-wrapper").css("width", "360px");
    });



    return (
        <div className='sidebar-toggle-mode'>
            <div className="page-wrapper chiller-theme toggled" style={{width:"100%"}}>
                <a id="show-sidebar" className="btn btn-sm btn-dark">
                <i className="fas fa-bars"></i>
                </a>
            <nav id="sidebar" className="sidebar-wrapper" >
                <div className='absolute-position-menu'>

                
                <div className="sidebar-content">
                    <div className="sidebar-brand">
                    {/*-- 메인화면으로 이동 링크 걸 예정 --*/}
                    <span style={{display:"inline-block", marginRight:"210px", marginTop:"5px"}}><Link to="/"><span style={{color:"black", fontSize:"30px", fontWeight:"bold"}}>FITME</span></Link></span>
                    
                    {/*-- 사이드바 토글 jquery --*/}
                    <div id="close-sidebar">
                        <i className="fas fa-times" style={{fontSize:"25px"}}></i>
                    </div>
                    </div>
                    <div className="sidebar-header">
                    {/*-- 사용자 프로필 --*/}
                    <div className="user-pic">
                        <img className="img-responsive img-rounded" src={accountData.image} alt="User picture"/>
                    </div>
                    {/*-- 사용자 이름 정보 --*/}
                    <div className="user-info">
                        <span className="user-name">
                        <strong>{accountData.name}</strong>
                        </span>
                        <span className="user-status">
                        <i className="fa fa-circle"></i>
                        <span>Online</span>
                        </span>
                    </div>
                    </div>
                    {/*-- sidebar-header --*/}
                    <div className="sidebar-search" style={{padding:"0px"}}>

                        {/* ★★★★★★★★★★★★★★★  날짜 설정  ★★★★★★★★★★★★★★★*/}
                        <div className="input-group">
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
                        <DemoContainer components={['DatePicker']}>
                        <DatePicker
                            // value={selectOne != null ? selectOne[5] : ''}
                            label="날짜 설정" 
                            onChange={(e) => week(e)} // 변경값을 콘솔에 출력
                            //value={dayjs(selectOne == '' || selectOne == null ? moment(value).format("YYYY-MM-DD 00:00") : selectOne[5])}
                            slotProps={{
                                textField: {
                                    size: "small",
                                    format: 'YYYY-MM-DD HH:mm',
                                    style:{backgroundColor:'white', width:"350px"},
                                },
                                }
                            }
                        />
                        </DemoContainer>
                        </LocalizationProvider>
                        </div>
                        {/* <div>{moment(value).format("YYYY-MM-DD 01:00")}</div> */}
                        <div className="date_picker-mp">
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">

                        </LocalizationProvider>
                        </div>
                    </div>

                    {/*-- sidebar-header --*/}
                    <div className="sidebar-menu">
                    <ul>
                        <li className="sidebar-header-menu">
                            <span className="sidebar-header-menu-title">Menu</span>
                        </li>
                        {/*-- 대메뉴 영역  --*/}
                        <li className="sidebar-dropdown" onClick={MenuSlide}>
                        <a>
                            <i className="fa-solid fa-user event-null"></i>
                            <span className="event-null">User</span>
                        </a>
                        <div className="sidebar-submenu">
                            <ul>
                            <li>
                                <span onClick={Scroll_Profile}>
                                    Profile
                                </span>
                            </li>
                            <li>
                                <span onClick={Scroll_Inbody}>
                                    Inbody
                                </span>
                            </li>
                            </ul>
                        </div>
                        </li>


                        {/*--------- 대메뉴 영역  ---------*/}
                        <li className="sidebar-dropdown" onClick={MenuSlide}>
                            <a>
                                <i className="fa-solid fa-chart-pie event-null"></i>
                                <span className="event-null">Statistic</span>
                            </a>
                            <div className="sidebar-submenu">
                                <ul>
                                    <li>
                                        <span onClick={Scroll_Statistic_Diet}>
                                            Diet
                                        </span>
                                    </li>
                                    <li>
                                        <span onClick={Scroll_Statistic_Workout}>
                                            Workout
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        {/*---------------------------------------------------*/}



                        {/*--------- 대메뉴 영역  ---------*/}
                        <li className="sidebar-dropdown" onClick={MenuSlide}>
                            <a>
                                <i className="fa-solid fa-box event-null"></i>
                                <span className="event-null">MyBox</span>
                            </a>
                            <div className="sidebar-submenu">
                                <ul>
                                    <li>
                                        <span onClick={Scroll_BulletinBoard}>
                                            Bulletin Board
                                        </span>
                                    </li>
                                    <li>
                                        <span onClick={Scroll_Youtube}>
                                            Youtube
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        {/*---------------------------------------------------*/}
                        
                        
                        
                        <li className="sidebar-header-menu">
                            <span className="sidebar-header-menu-title">Extra</span>
                        </li>
                        <li>
                        <a href="#">
                            <i className="fa fa-book"></i>
                            <span>Documentation</span>
                        </a>
                        </li>
                    </ul>
                    </div>
                </div>
                </div>


            {/*----------------- 사이드바 밑 아이콘 부분들 --------------*/}
            <div className="sidebar-footer">
                <a href="#">
                <i className="fa fa-bell"></i>
                {/*----------------- 사이드바 밑 아이콘 (알람) --------------*/}
                <span className="badge badge-pill badge-warning notification">3</span>
                </a>
                <a href="#">
                <i className="fa fa-envelope"></i>
                {/*----------------- 사이드바 밑 아이콘 (메세지) --------------*/}
                <span className="badge badge-pill badge-success notification">7</span>
                </a>
                <a href="#">
                <i className="fa fa-cog"></i>
                {/*----------------- 사이드바 밑 아이콘 (다크모드 설정) --------------*/}
                <span className="badge-sonar"></span>
                </a>
            </div>
            </nav>
            </div>
        </div>
    );
  }
  
  export default MyPageSidebar;
  




