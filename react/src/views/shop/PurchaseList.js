import HeaderTop from "../component/headerTop/HeaderTop";
import Header from "../component/header/Header";
import Loader from "../component/loader/Loader";
import Breadcumb from "../component/Breadcumb/Breadcumb";
import ChatBot from "../component/chatBot/ChatBot";
import $ from 'jquery';
import { useEffect, useState } from "react";
import './Shop.css';
import PurchaseListContainer from "./component/PurchaseListContainer.js"; 


function PurchaseList() {
    // 장바구니 아이템 상태 정의
     const [cartItems, setCartItems] = useState([]);
    // 총 가격 상태 정의
     const [totalAmount, setTotalAmount] = useState(0);
    // 선택된 상품들의 이름 상태 정의
     const [productNames, setProductNames] = useState([]); // 선택된 상품들의 이름을 저장할 상태
    // 계정 번호 상태 정의
    const [accountNo, setAccountNo] = useState('');
     // 선택된 상품들의 상태 정의
    const [selectedItems, setSelectedItems] = useState([]);
    // 선택된 상품들의 이름을 관리하는 상태 정의
    const [selectedProductNames, setSelectedProductNames] = useState([]);

    // 선택된 상품들의 이름 변경 시 실행되는 함수
    const handleProductNamesChange = (productNames) => {
        setSelectedProductNames(productNames);
    };

     // 총 가격 변경 시 실행되는 함수
     const handleTotalAmountChange = (totalAmount) => {
       setTotalAmount(totalAmount);
     };
 
     useEffect(()=>{
         $('body').addClass('loaded');
     });

    return (
        <div>
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
                                    <a href="/shop">Go to store list</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="portfolio-area food-template">
                <div className="food-list-selector"style={{marginLeft:'-310px'}}>
                    <div>
                        내 구매 목록
                    </div>
                    
                </div>
                
                <div className="container">
                {/* CartListContainer에 cartItems와 함수를 전달 */}
                <PurchaseListContainer
                    cartItems={cartItems}  // 장바구니 아이템 목록 전달
                    selectedItems={selectedItems}  // 선택된 아이템 목록 전달
                    onProductNamesChange={handleProductNamesChange}  // 상품명 변경 시 실행될 함수 전달
                    onTotalAmountChange={handleTotalAmountChange}  // 총 가격 변경 시 실행될 함수 전달
                />
                </div>
            </div>
        <ChatBot/>
        </div>

  );
}

export default PurchaseList;

