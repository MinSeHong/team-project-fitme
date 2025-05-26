// React 및 useEffect 가져오기
import React, { useEffect } from "react";

// disableScroll 및 enableScroll 함수 정의
const disableScroll = () => {
  // 스크롤 비활성화를 위한 구현
  document.body.style.overflow = 'hidden';
};

const enableScroll = () => {
  // 스크롤 활성화를 위한 구현
  document.body.style.overflow = 'auto';
};

// Modal 컴포넌트
function Modal(props) {
  useEffect(() => {
    // modal이 떠 있을 땐 스크롤 막음
    disableScroll();
    // modal 닫히면 다시 스크롤 가능하도록 함
    return () => enableScroll();
  }, []);

  function closeModal() {
    props.onClose();
  }

  return (
    <div className="Modal" onMouseDown={closeModal}>
      <div className="modalBody_w" onMouseDown={(e) => e.stopPropagation()}>
        <button id="modalCloseBtn" onMouseDown={closeModal}>
          ✖
        </button>
        {props.children}
      </div>
    </div>
  );
}

export default Modal;