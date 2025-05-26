// React 및 useEffect 가져오기
import React, { useState, useEffect } from "react";
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import './CommunityBoardViewModal.css';

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
function CommunityBoardEditModal(props) {

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

  const myCookieValue = getCookie('Authorization');

  useEffect(() => {
    // modal이 떠 있을 땐 스크롤 막음
    disableScroll();
    // modal 닫히면 다시 스크롤 가능하도록 함
    return () => enableScroll();
  }, []);

  function closeModal() {
    props.onClose();
  }

  //OwlCarousel 기능
  const options = {
    margin:10,
    loop: true,
    items: 1,
    dots:false,
    autoplay:true,
    autoplayTimeout: 4500,
    smartSpeed: 450,
  };

  

  const onClickButton = async (e) => {

    e.preventDefault();
    
    
  };

  return (
    <div className="Modal" onMouseDown={closeModal}>
      <div className="modalBody" onMouseDown={(e) => e.stopPropagation()} style={{width: '800px',
        height: '950px', overflow:"hidden", backgroundColor:"rgba(0,0,0,0)", boxShadow:"none"}}>
        <div className="col-lg-12 col-sm-12">
            <form className="blog-single-box upper" style={{ backgroundColor: "#F6F4EC", height:"910px"}} onSubmit={onClickButton}>
                <div style={{position: "relative", width:"92%", height:"500px", margin:"auto", marginTop:"30px", background:"white", borderRadius:"5px", border:"1px solid #c2cfdb"}}>
                    {/*!inputHidden && (*/
                        <>
                            <label htmlFor="file" className='blog-image-button'>Images</label>
                            <input type="file" id="file" style={{ display: "none" }} multiple /*onChange={handleFileChange}*/ />
                        </>
                    /*)*/}
                    <OwlCarousel {...options}>
                        {props.boardImages.map((image, index) => (
                            <div className="blog-thumb" key={index}>
                                <img src={image} alt="" style={{ height: 500 }} />
                                <div className="blog-btn">
                                  <div>{`${index + 1}/${props.boardImages.length}`}</div>
                                </div>
                            </div>
                        ))}
                    </OwlCarousel>
                </div>
                <div className="blog-content" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div>
                        <input type="text" style={{ width: "100%", textAlign: "center" }} placeholder='제목을 입력하세요' name='title' value={props.title}/>
                    </div>
                    <div>
                        <textarea style={{ width: "100%", height: "200px" }} name='boardComment' value={props.comment}></textarea>
                    </div>
                    <div className="community-hashtag">
                    {props.category.split(",").map(tag => tag.trim()).filter(tag => tag !== "")
                      .map((tag, index) => (
                          <span key={index}>{tag}</span>
                      ))}
                    </div>

                    <div style={{ display: "flex", flexDirection: "row-reverse", gap: "10px" }}>
                        <button className="community-write-button" style={{width:"160px"}} onMouseDown={closeModal}>Back</button>
                        <button className="community-write-button" style={{width:"160px"}}>Edit</button>
                        <input type="text" className="community-modal-select" placeholder='HashTag'>
                        </input>
                    </div>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
}

export default CommunityBoardEditModal;