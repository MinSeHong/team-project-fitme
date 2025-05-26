import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PurchaseListContainer.css';

function PurchaseListContainer(props) {
  const sendTotalAmountToParent = (totalAmount) => {
    props.onTotalAmountChange(totalAmount);
  };

  const initialCartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [quantities, setQuantities] = useState(cartItems.map(() => 1));
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedProductNames, setSelectedProductNames] = useState([]);
  // 서버로부터 받아온 데이터를 저장할 상태 추가
  const [paymentList, setPaymentList] = useState([]);

  const handleProductNamesChange = (productNames) => {
    setSelectedProductNames(productNames);
  };

  useEffect(() => {
    props.onProductNamesChange(selectedProductNames); // 선택된 상품명 변경 시 부모 컴포넌트로 전달
  }, [selectedProductNames]);

  useEffect(() => {
    sendProductNamesToParent();
  }, [cartItems, quantities, selectedItems]); // selectedItems도 추가

  const handleQuantityChange = (index, event) => {
    const newQuantities = [...quantities];
    newQuantities[index] = parseInt(event.target.value);
    setQuantities(newQuantities);
    sendTotalAmountToParent(calculateTotalAmount(selectedItems));
  };

  const handleItemToggle = (index) => {
    let newSelectedItems;
    if (selectedItems.includes(index)) {
      newSelectedItems = selectedItems.filter(itemIndex => itemIndex !== index);
    } else {
      newSelectedItems = [...selectedItems, index];
    }
    setSelectedItems(newSelectedItems); // 선택된 아이템 업데이트
    sendProductNamesToParent(newSelectedItems); // 선택된 아이템에 기반하여 상품명 업데이트
    if (newSelectedItems.length > 0) {
      sendTotalAmountToParent(calculateTotalAmount(newSelectedItems));
    } else {
      sendTotalAmountToParent(0);
    }
  };

  const sendProductNamesToParent = () => {
    if (selectedItems && selectedItems.length > 0) {
      const selectedProducts = selectedItems.map(index => cartItems[index].title);
      handleProductNamesChange(selectedProducts);
    } else {
      handleProductNamesChange([]);
    }
  };

  const handleRemoveItem = (index) => {
    const totalAmount = calculateTotalAmount(selectedItems);
    const newCartItems = cartItems.filter((item, idx) => idx !== index);
    const newSelectedItems = selectedItems.filter(itemIndex => itemIndex !== index);
    sessionStorage.setItem('cartItems', JSON.stringify(newCartItems));
    setCartItems(newCartItems);
    setSelectedItems(newSelectedItems);
    sendTotalAmountToParent(totalAmount);
    sendProductNamesToParent();
    return totalAmount;
  };

  const calculateTotalAmount = (selectedItems) => {
    if (!selectedItems || selectedItems.length === 0) {
      return 0;
    }

    let total = 0;
    selectedItems.forEach((index) => {
      const price = parseInt(cartItems[index].price.replace(/[^\d]/g, ''));
      total += price;
    });
    return total;
  };

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

// useEffect를 통해 서버로부터 데이터를 가져오고 받아온 데이터를 상태에 저장
useEffect(() => {
  const fetchData = async () => {
    try {
      const myCookieValue = getCookie('Authorization');
      const response = await axios.get('http://192.168.0.53:8080/api/v1/payment/list', {
        headers: {
          'Authorization': myCookieValue,
          'Content-Type': 'application/json; charset=UTF-8'
        }
      });
      const data = response.data;
      setPaymentList(data); // 받아온 데이터를 상태에 저장
    } catch (error) {
      console.error('Error fetching payment list:', error);
    }
  };

  fetchData();
}, []);
 // 빈 배열을 두어 컴포넌트가 처음 마운트될 때만 실행되도록 함

  

  // 화면에 받아온 데이터를 출력
  return (
    <div className="cart-list-container">
      <div className="fill-table-layout">
        <div className="table grey-header-table w-100 receipt-table">
          <div className="thead thd">
            <div className="tr">
              <div className="th td-amount ta text-right pr-4">상품명</div>
              <div className="th td-method tm">결제금액</div>
              <div className="th td-method tm">결제수단</div>
              <div className="th td-action ta">결제날짜</div>
            </div>
          </div>
          <div className="tbody">
            {paymentList.map((payment, index) => (
              <div className="tr" key={index}>
                <div className="td td-amount ta text-right pr-4 font-weight-bold">
                  {payment.payName}
                </div>
                <div className="td td-method tm">
                  <div className="pg">{payment.payPrice}원</div>
                </div>
                <div className="td td-method tm">
                  <div className='pg'>{payment.payMethod}</div>
                </div>
                <div className="td td-action ta text-center">
                  <div className='pg'>{payment.payDate}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PurchaseListContainer;
