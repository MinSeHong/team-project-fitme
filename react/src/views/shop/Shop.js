import React,{useEffect, useState} from 'react';
import $ from 'jquery';
import './Shop.css';
import HeaderTop from "../component/headerTop/HeaderTop";
import Header from "../component/header/Header";
import Loader from "../component/loader/Loader";
import Breadcumb from "../component/Breadcumb/Breadcumb";
import ChatBot from "../component/chatBot/ChatBot";
import ShopListContainer from "./component/ShopListContainer";
import axios from 'axios'; //npm install axios
import Banner from "./component/shopbanner";



const ipAddress = '192.168.0.53';

//배열 섞기
function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

function Shop() {

    //목록 데이타 저장
    const [shopData,setShopData] = useState([]);
    //셔플된 전체 데이타 
    const [shopDataAll,setShopDataAll] = useState([]);

    useEffect(()=>{
        $('body').addClass('loaded');

        //서버에서 크롤링 json 가져오기
        axios.get(`http://${ipAddress}:5000/crawlingShop`)
        .then(res=>{
            setShopData(res.data);
            console.log(res.data); // 데이터를 콘솔에 로그로 출력
        })
        .catch(error => {
            console.error('데이터 가져오기 오류:', error);
        });

    },[]);

    useEffect(() => {
        const data = [];
        if (shopData != null) {
            console.log('data', shopData);
            shopData.map(item => {
                console.log('data', item.name);
                data.push(item);
            });
            shuffle(data);
            setShopDataAll(data);
        }
    }, [shopData]);


    //리스트 정렬

    const sortDataByPrice = (order) => {
        const sortedData = [...shopDataAll];
        sortedData.sort((a, b) => {
          const priceA = parseFloat(a.price);
          const priceB = parseFloat(b.price);
          return order === 'asc' ? priceA - priceB : priceB - priceA;
        });
        setShopDataAll(sortedData);
      };
    
    const handleSortChange = (e) => {
    const selectedValue = e.target.value;

    if (selectedValue === 'createdAt') {
        setShopDataAll([...shopData]);// 디폴트값(정렬x)
        } else if (selectedValue === 'descendingOrder') {
            sortDataByPrice('desc');
        } else if (selectedValue === 'ascendingOrder') {
            sortDataByPrice('asc');
        }
    };

    const [cartItems, setCartItems] = useState([]); // 장바구니에 담긴 상품 정보를 저장할 상태
    // 상품을 장바구니에 추가하는 함수
    const handleAddToCart = (item) => {
        setCartItems([...cartItems, item]);
    };
    
  return (
    <div className="shop1">
        {/*헤더 위*/}
        <HeaderTop/>
        {/*헤더 메인 메뉴*/}
        <Header/>
        {/* 로딩 애니메이션*/}
        <Loader/>

        <div className="footer-top-2-s d-flex align-items-center">
            <div className="container">
                <div className="row">
                    <div className="col-lg-6 col-md-6">
                        <div className="single-footer-top-box">
                            <div className="footer-top-title-s">
                                <h1>FitMe&Metree<br/>OnlineShop</h1>
                                <h3>간편하게, 신선하게, 맛있게 - FitMe&Metree와 함께하는 온라인 쇼핑</h3>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                        <div className="single-footer-top-box">
                            <div className="footer-top-button-s">
                                <a href="/cart"> Go to cart</a>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="portfolio-area food-template">
            <Banner/>
            <div className="food-list-selector">
                
                <div>
                <span style={{ fontWeight: 'bold',fontSize:'20px' }}>{shopDataAll.length}</span> 개의 상품
                </div>
                
                
                <select id='sort' className='sortList' onChange={handleSortChange}>
                    <option value='createdAt' defaultValue>최신순</option>
                    <option value='descendingOrder'>높은 가격순</option>
                    <option value='ascendingOrder'>낮은 가격순</option>
                </select>

                {/*
                <button onClick={() => sortDataByPrice('desc')}>
                    높은 가격순
                </button>

                <button onClick={() => sortDataByPrice('asc')}>
                    낮은 가격순
                </button >
                */}

            </div>
            
            <div className="container">
                {shopDataAll.map((item, index) => (
                    (index % 3 === 0) ? (
                        <div className="row" key={index}>
                            {shopDataAll.slice(index, index + 3).map((subItem, subIndex) => (
                                <div className="col" key={index + subIndex}>
                                    <ShopListContainer data={subItem} onAddToCart={handleAddToCart} />
                                </div>
                            ))}
                        </div>
                    ) : null
                ))}
            </div>
        </div>
        <ChatBot/>
        </div>
  );
}

export default Shop;

