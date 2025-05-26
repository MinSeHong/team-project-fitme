import {Link} from 'react-router-dom';
import React,{useEffect, useState} from 'react';

import Header from '../../component/header/Header';
import HeaderTop from '../../component/headerTop/HeaderTop';
import Image_test from '../../../assets/images/blog-3.jpg';
import ChatBot from '../../component/chatBot/ChatBot';
import Loader from '../../component/loader/Loader';
import Breadcumb from '../../component/Breadcumb/Breadcumb';
import RatingStars from './component/RatingStars';
import RecipeBoard from './component/RecipeBoard';
import $ from 'jquery';
import axios from 'axios'; //npm install axios

import img_recipe from '../../../assets/images/breadcumb/recipe.jpg'

const ipAddress = '192.168.0.53';

//배열 섞기
function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

function Recipe() {

    const [recipeBoardViewModal,setRecipeBoardViewModal] = useState(true);

    //음식 데이타 저장
    const [recipeData,setRecipeData] = useState([]);
    //클릭 받은 데이타
    const [nowRecipeData,setNowRecipeData] = useState();
    //셔플된 전체 데이타 
    const [recipeDataAll,setRecipeDataAll] = useState([]);
    
    useEffect(()=>{
        $('body').addClass('loaded');

        //서버에서 클롤링 json 가져오기
        axios.get(`http://${ipAddress}:5000/crawling`)
        .then(res=>{
            setRecipeData(res.data);
        })

    },[]);

    //전체값을 불러오기
    useEffect(() => {
        const data = [];
        if (recipeData && recipeData['한식']) {
            recipeData['한식'].map(item => {
                // console.log('data', item.name);
                data.push(item);
            });
            recipeData['중식'].map(item => {
                // console.log('data', item.name);
                data.push(item);
            });
            recipeData['일식'].map(item => {
                // console.log('data', item.name);
                data.push(item);
            });
            recipeData['양식'].map(item => {
                // console.log('data', item.name);
                data.push(item);
            });
            shuffle(data);
            setRecipeDataAll(data);
        }
        var l = document.querySelector('.current_menu_item');
        if(l.textContent ==='전체'){
            setNowRecipeData(data);
        }
    }, [recipeData]);
    

    //음식 카테고리(?) 함수
    function menu(e){
        // console.log('e',e.target.textContent);
        var l = document.querySelector('.current_menu_item');
        if(e.target.textContent !== '전체중식일식양식한식'){ //버튼 클릭시 확인
            // console.log(l.textContent) //현재의 강조표시가 어디인지 확인
            l.className=''; //이전 클래스의 위치 제거
            e.target.className = 'current_menu_item'; //현재 클릭된 위치에 클래스 씌워주기
            if(recipeData != null) {
                // console.log('recipeData[e.target.textContent]',recipeData[e.target.textContent]);
                setNowRecipeData(recipeData[e.target.textContent]);
                if(e.target.textContent === '전체') setNowRecipeData(recipeDataAll);
            }

        }
    }

  return (
    <div>
        {/*헤더 위*/}
        <HeaderTop/>
        {/*헤더 메인 메뉴*/}
        <Header/>
        {/* 로딩 애니메이션*/}
        <Loader/>
        {/* 제목 배경화면 */}
        <Breadcumb title="Recipe" content="Social" img_title={img_recipe}/>

        <div className="portfolio-area">
            <div className="container">
                {/*카테고리 영역*/}
                <div className="row">
                    <div className="col-lg-12 col-sm-12">
                        <div className="portfolio_nav text-center">
                            <div className="portfolio_menu">
                                <ul className="menu-filtering" onClick = {menu}>
                                    <li className="current_menu_item">전체</li>
                                    <li>중식</li>
                                    <li>일식</li>
                                    <li>양식</li>
                                    <li>한식</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="row image_load">
                    {nowRecipeData && nowRecipeData.map(item=>(
                        <RecipeBoard data={item}/>
                    ))}
                </div>
            </div>
        </div>

        








        {/*
        <!--==================================================-->
        <!-- Start brand-area -->
        <!--==================================================-->
        */}
        <div className="brand-area">
            <div className="container">
                <div className="row">
                    <div className="owl-carousel brand_list">
                        <div className="col-lg-12">
                            <div className="single-brand-box">
                                <div className="brand-thumb">
                                    <img src="assets/images/client1.png" alt=""/>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <div className="single-brand-box">
                                <div className="brand-thumb">
                                    <img src="assets/images/client2.png" alt=""/>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <div className="single-brand-box">
                                <div className="brand-thumb">
                                    <img src="assets/images/client5.png" alt=""/>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <div className="single-brand-box">
                                <div className="brand-thumb">
                                    <img src="assets/images/client4.png" alt=""/>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <div className="single-brand-box">
                                <div className="brand-thumb">
                                    <img src="assets/images/client5.png" alt=""/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/*
        <!--==================================================-->
        <!-- Start footer-top-area -->
        <!--==================================================-->
        */}
        <div className="footer-top-2 d-flex align-items-center">
            <div className="container">
                <div className="row">
                    <div className="col-lg-6 col-md-6">
                        <div className="single-footer-top-box">
                            <div className="footer-top-title">
                                <h1>Awesome harvest we grow last 10 years</h1>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                        <div className="single-footer-top-box">
                            <div className="footer-top-button">
                                <a href="#">Discover More</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/*
        <!--==================================================-->
        <!-- Start footer_section -->
        <!--==================================================-->
        */}
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



        {/*
        <!--==================================================-->
        <!----- Start Search Popup Area ----->
        <!--==================================================-->
        */}
            <div className="search-popup">
                <button className="close-search style-two"><i className="fa fa-times"></i></button>
                <button className="close-search"><i className="fas fa-arrow-up"></i></button>
                <form method="post" action="#">
                    <div className="form-group">
                        <input type="search" name="search-field" value="" placeholder="Search Here" required=""/>
                        <button type="submit"><i className="fa fa-search"></i></button>
                    </div>
                </form>
            </div>
        {/*
        <!--==================================================-->
        <!----- Start Search Popup Area ----->
        <!--==================================================-->
        */}
        <ChatBot/>
        </div>
    </div>
  );
}

export default Recipe;

