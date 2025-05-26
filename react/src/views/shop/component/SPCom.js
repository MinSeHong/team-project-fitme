import React, { useState } from 'react';
import ShopListContainer from './ShopListContainer';
import CartListContainer from './CartListContainer';

function ParentComponent() {
  // 장바구니 아이템 상태
  const [cartItems, setCartItems] = useState([]);
  console.log("cartItems:",cartItems);
  // 상품을 장바구니에 추가하는 함수
  const handleAddToCart = (item) => {
    setCartItems([...cartItems, item]);
  };

  return (
    <div>
      {/* ShopListContainer에 상품 데이터와 추가 함수 전달 */}
      <ShopListContainer onAddToCart={handleAddToCart} />
      {/* CartListContainer에 장바구니 아이템 전달 */}
      <CartListContainer cartItems={cartItems} />
    </div>
  );
}

export default ParentComponent;
