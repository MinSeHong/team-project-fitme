import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2'; // SweetAlert2를 import합니다.
import './CartListContainer.css';

function CartListContainer(props) {
  const initialCartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [quantities, setQuantities] = useState(cartItems.map(() => 1));
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedProductNames, setSelectedProductNames] = useState([]);

  const handleProductNamesChange = (productNames) => {
    setSelectedProductNames(productNames);
    props.onProductNamesChange(productNames); // 선택된 상품명 변경 시 부모 컴포넌트로 전달
  };

  useEffect(() => {
    sendTotalAmountToParent(calculateTotalAmount(selectedItems));
  }, [selectedItems, cartItems, quantities]); // 총 가격이 변동될 때마다 부모 컴포넌트로 전달

  const handleQuantityChange = (index, event) => {
    const newQuantities = [...quantities];
    newQuantities[index] = parseInt(event.target.value);
    setQuantities(newQuantities);
    const newCartItems = [...cartItems];
    newCartItems[index].quantity = parseInt(event.target.value);
    setCartItems(newCartItems);
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
  };

  const sendTotalAmountToParent = (totalAmount) => {
    props.onTotalAmountChange(totalAmount);
  };

  const handleRemoveItem = (index) => {
    Swal.fire({ // SweetAlert2 다이얼로그를 띄웁니다.
      title: '삭제하시겠습니까?',
      text: '삭제된 상품은 되돌릴 수 없습니다.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '삭제',
      cancelButtonText: '취소',
      scrollbarPadding: false,
      heightAuto: false
      
    }).then((result) => {
      if (result.isConfirmed) {
        const newCartItems = cartItems.filter((item, idx) => idx !== index);
        const newSelectedItems = selectedItems.filter(itemIndex => itemIndex !== index);
        sessionStorage.setItem('cartItems', JSON.stringify(newCartItems));
        setCartItems(newCartItems);
        setSelectedItems(newSelectedItems);
        sendProductNamesToParent(newSelectedItems); // 선택된 상품명 업데이트
        Swal.fire(
          '삭제됨!',
          '상품이 삭제되었습니다.',
          'success'
        );
      }
    });
  };

  // 결제가 완료된 상품을 장바구니에서 삭제하는 함수
  const removeItemsAfterPayment = (selectedItems) => {
    selectedItems.forEach((index) => {
      const newCartItems = cartItems.filter((item, idx) => idx !== index);
      setCartItems(newCartItems);
    });
    setSelectedItems([]);
    sendProductNamesToParent([]); // 선택된 상품명 업데이트
    sessionStorage.removeItem('selectedItems'); // 선택된 상품 세션 스토리지에서 삭제
  };

  const calculateTotalAmount = (selectedItems) => {
    if (!selectedItems || selectedItems.length === 0) {
      return 0;
    }

    let total = 0;
    selectedItems.forEach((index) => {
      const price = parseInt(cartItems[index].price.replace(/[^\d]/g, ''));
      const quantity = quantities[index];
      total += price * quantity;
    });
    return total;
  };

  const sendProductNamesToParent = (selectedItems) => {
    if (!selectedItems || selectedItems.length === 0) {
      handleProductNamesChange([]);
      return;
    }
    const selectedProducts = selectedItems.map(index => cartItems[index].title);
    handleProductNamesChange(selectedProducts);
  };

  return (
    <div className="cart-list-container">
      <div className="fill-table-layout">
        <div className="table grey-header-table w-100 receipt-table">
          <div className="thead">
            <div className="tr">
              <div className="th td-name">상품</div>
              <div className="th td-amount text-right pr-4">상품명</div>
              <div className="th td-method">결제금액</div>
              <div className="th td-method">수량</div>
              <div className="th td-action">선택</div>
            </div>
          </div>
          <div className="tbody">
            {cartItems.map((item, index) => (
              <div className="tr" key={index}>
                <div className="td td-name">
                  <img className='thumbnail' src={item.thumbnail} alt="상품 이미지" />
                </div>
                <div className="td td-amount text-right pr-4 font-weight-bold">{item.title}</div>
                <div className="td td-method">
                  <div className="pg">{item.price}</div>
                </div>
                <div className="td td-method">
                  <select value={quantities[index]} onChange={(event) => handleQuantityChange(index, event)}>
                    {[...Array(10).keys()].map((quantity) => (
                      <option key={quantity} value={quantity + 1}>{quantity + 1}</option>
                    ))}
                  </select>
                </div>
                <div className="td td-action text-center">
                  <input type="checkbox" checked={selectedItems.includes(index)} onChange={() => handleItemToggle(index)} />
                  <button onClick={() => handleRemoveItem(index)}>삭제</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="total-amount">
        총 가격: {calculateTotalAmount(selectedItems).toLocaleString()} 원
      </div>
    </div>
  );
}

export default CartListContainer;
