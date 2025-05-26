// React 및 useEffect 가져오기
import React, { useEffect, useState } from "react";
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import './RecipeBoardViewModal.css';


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
function RecipeBoardViewModal(props) {
  useEffect(() => {
    // modal이 떠 있을 땐 스크롤 막음
    disableScroll();
    // modal 닫히면 다시 스크롤 가능하도록 함
    return () => enableScroll();
  }, []);

  function closeModal() {
    props.onClose();
  }


  const options = {
    loop: true,
    items: 1,
    dots:false,
    autoplay:true,
    autoplayTimeout: 4500,
    smartSpeed: 450,
  };

  const [menuToggle, setMenuToggle] = useState(true);

  return (
    <div className="Modal" onMouseDown={closeModal}>
      <div className="modalBody recipe-modal" onMouseDown={(e) => e.stopPropagation()} style={{width: '800px', height: '800px', overflow:"hidden", backgroundColor:"rgba(0,0,0,0)", boxShadow:"none", position:"relative"}}>
          <div className="cont_central">
            <div className="cont_modal cont_modal_active">
              <div className="cont_photo">

                <div className="cont_mins">
                  <div className="sub_mins">
                    <h3>50</h3>
                    <span>MINS</span>
                  </div>
                </div>
                
                <div className="cont_servings">
                  <h3>4</h3><span>SERVINGS</span>
                </div>

                <div className="cont_detalles">
                  <h3>음식 제목</h3>
                  <p>음식 제목에 대한 간단한 설명 ㅇㅇ 스크롤도 넣음. <br/>
                  음식 제목에 대한 간단한 설명 ㅇㅇ 음식 제목에 대한 간단한 설명ㅇ
                  dasffsfadsfsdfasf ㅁㄹㅇㅁㄴㄻㄴ  ㅁㄴㅇㄻㄴㅇㄹ
                  ㅇㄴㄹㅇㅁㄴ ㄹㄻ ㅇㄻㄴㄹ asfas f
                  adfsd faf sdf asㄻ ㄴㄻㄴ ㄹㅇㄴㅁㄹ ㄴㅁㅇㄹ
                  </p>
                </div>
                
                <div className="cont_img_back">
                    {/*********** 음식 이미지 부분 *********** */}
                    <OwlCarousel {...options}>
                    <img src="https://s-media-cache-ak0.pinimg.com/736x/57/98/9f/57989f2a2e186e38bf93429aa395120c.jpg" alt="" />
                    </OwlCarousel>
                </div>

              </div>


              
                <div className="cont_text_ingredients">
                  <div className="cont_over_hidden">
                    <div className="cont_tabs">
                      <ul>
                        {/****************  메뉴 이동 토글   *********************/}
                        <li><a href="#" onClick={()=>{setMenuToggle(true)}} style={ menuToggle ? {borderTop:"7px solid #ED346C"} : {borderTop:"7px solid white"} }><h4>INGREDIENTS</h4></a></li>
                        <li><a href="#" onClick={()=>{setMenuToggle(false)}} style={ !menuToggle ? {borderTop:"7px solid #ED346C"} : {borderTop:"7px solid white"} }><h4>INGREDIENTS</h4></a></li>
                      </ul>  
                    </div>

                    {menuToggle ?
                    <div className="cont_over_scroll">
                      <div className="cont_text_det_preparation">
                        <div className="cont_title_preparation">
                          <p>재료임</p>
                        </div>
                        <div className="cont_info_preparation">
                          <p>ㅇㅇ</p>
                        </div>
                      </div>  
                      
                    </div>


                    :


                    <div className="cont_over_scroll">
                      <div className="cont_text_det_preparation">
                        <div className="cont_title_preparation">
                          <p>STEP 1</p>
                        </div>
                        <div className="cont_info_preparation">
                          <p>만드는 방법1 만드는 방법1만드는 방법1만드는 방법1만드는 방법1만드는 방법1</p>
                        </div>
                      </div>  
                      

                      <div className="cont_text_det_preparation">
                        <div className="cont_title_preparation">
                          <p>STEP 2</p>
                        </div>
                        <div className="cont_info_preparation">
                          <p>만드는 방법2 만드는 방법2만드는 방법2만드는 방법2만드는 방법2만드는 방법2만드는 방법2만드는 방법2만드는 방법2만드는 방법2만드는 방법2만드는 방법2만드는 방법2만드는 방법2만드는 방법2만드는 방법2만드는 방법2만드는 방법2만드는 방법2만드는 방법2만드는 방법2만드는 방법2만드는 방법2만드는 방법2만드는 방법2</p>
                        </div>
                      </div>  

                      <div className="cont_text_det_preparation">
                        <div className="cont_title_preparation">
                          <p>STEP 2</p>
                        </div>
                        <div className="cont_info_preparation">
                          <p>만드는 방법2 만드는 방법2만드는 방법2만드는 방법2만드는 방법2만드는 방법2만드는 방법2만드는 방법2만드는 방법2만드는 방법2만드는 방법2만드는 방법2만드는 방법2만드는 방법2만드는 방법2만드는 방법2만드는 방법2만드는 방법2만드는 방법2만드는 방법2만드는 방법2만드는 방법2만드는 방법2만드는 방법2만드는 방법2</p>
                        </div>
                      </div>
                    </div>
                    
                  }

                  </div>
                </div>
              
              



            </div>
          </div>
      </div>
    </div>
  );
}

export default RecipeBoardViewModal;