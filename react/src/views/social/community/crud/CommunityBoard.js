import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CommunityBoard.css';
import $ from 'jquery';
import swal from 'sweetalert2';

import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import CommunityBoardViewModal from './CommunityBoardViewModal';
import CommunityBoardViewModal_ from './CommunityBoardViewModal_';
import CommunityBoardEditModal from './CommunityBoardEditModal';

function CommunityBoard(props) {

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

    //이미지 서버에서 이미지 받아오기
    async function imageData(code){
        return await new Promise((resolve,reject)=>{
        try{
            axios.get(`http://192.168.0.53:5050/image/${code == null ? 41 : code}`)
            .then((response)=>{
                resolve("data:image/png;base64,"+response.data['image']);
            })
        }
        catch(err){reject(err)};
        },2000);
    }

    const [boardImages, setBoardImages] = useState([]);

    const options = {
        margin:10,
        loop: true,
        items: 1,
        dots:false,
        autoplay:true,
        autoplayTimeout: 4500,
        smartSpeed: 450,
    };

    const onModal = () => {
        setIsOpen(true);
    }

    function handleButtonClick(accountNo) {
        props.onButtonClicked(accountNo);
    }

    //게시글에 등록된 이미지 axios
    useEffect(() => {
        const fetchBoardImages = async () => {
            try {
                
                const response = await axios.get(`http://192.168.0.53:8080/api/v1/boards/images/${props.bno}`, {
                    headers: {
                        'Authorization': `${myCookieValue}`,
                        'Content-Type': 'application/json; charset=UTF-8'
                    }
                });
                
                const updatedImages = await Promise.all(response.data.map(async boardImage => {
                    const image = await imageData(boardImage);
                    return image;
                }));

                setBoardImages(updatedImages);
            } catch (error) {
                console.error(error);
            }
        };
    
        fetchBoardImages(); 
        
    }, [props.key]);

    

    //좋아요 버튼 기능
    const [isLiked, setIsLiked] = useState(false);
    const [isBeating, setIsBeating] = useState(false);
    const [checkLike, setCheckLike] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const data = new FormData();

    //좋아요 누른지 여부 확인
    useEffect(() => {
        axios.get(`http://192.168.0.53:8080/api/v1/boards/like/${props.bno}`, {
            headers: {
                'Authorization': `${myCookieValue}`,
                'Content-Type': 'application/json; charset=UTF-8'
            }
        })
        .then(response => {
            setCheckLike(response.data);
            if(response.data == 0) {
                setIsLiked(false);
            } else {
                setIsLiked(true);
            }
        })
    },[checkLike])

    //마우스가 하트 버튼에 들어왔을 시 애니메이션 true
    const handleMouseEnter = () => {
        setIsBeating(true);
    };

    //마우스가 하트 버튼에서 벗어났으 시 애니메이션 false
    const handleMouseLeave = () => {
        setIsBeating(false);
    };

    //좋아요 버튼 클릭 이벤트
    const handleClick = () => {

        data.append('bno', props.bno);
        data.append('preState', isLiked ? 1: 0);

        axios.post('http://192.168.0.53:8080/api/v1/boards/like', data , {
            headers: {
                'Authorization': `${myCookieValue}`,
                'Content-Type': 'application/json; charset=UTF-8'
            }
        })
        .then(response => {
            console.log(response.data);
        })
        .catch(err => {
            console.log(err);
        })
        setIsLiked(!isLiked);
        
    };

    //스크랩 관련
    const scrapHandle = () => {

        swal.fire({
            title: `해당 게시글을 스크랩하시겠습니까?`,
            text: "마이페이지에서 확인 가능",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "삭제",
            cancelButtonText: "취소",
        }).then(async (result) => {
            if(result.isConfirmed) {
                const bno = props.bno;
                axios.post('http://192.168.0.53:8080/api/v1/boards/scrap', bno, {
                    headers: {
                        'Authorization': `${myCookieValue}`,
                        'Content-Type': 'application/json; charset=UTF-8'
                    }
                })
                .then(response => {
                    console.log(response.data);
                    swal.fire({
                        title: "스크랩 성공!",
                        icon: "success",
                        button: "확인"
                    })
                })
                .catch(err => {
                    console.log(err);
                })
            }
        })

        
    };

    //게시글 삭제
    const onClickDelete = () => {
        swal.fire({
            title: "정말로 삭제하시겠습니까?",
            text: "삭제한 데이터는 복구할 수 없습니다!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "삭제",
            cancelButtonText: "취소",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const bno = props.bno;
                try {
                    const response = await axios.delete(`http://192.168.0.53:8080/api/v1/boards/${bno}`, {
                        headers: {
                            'Authorization': `${myCookieValue}`,
                            'Content-Type': 'application/json; charset=UTF-8'
                        }
                    });
                    const resMessge = response.data;
                    if (resMessge === '성공') {
                        swal.fire({
                            title: "삭제 성공!",
                            icon: "success",
                            button: "확인"
                        }).then(value => {
                            props.setOnDelete(value);
                        });
                    } else {
                        swal.fire({
                            title: "삭제 실패!",
                            icon: "error",
                            button: "확인"
                        }).then(value => {
                            props.setOnDelete(value);
                        });
                    }
                } catch (error) {
                    console.error("삭제 요청 중 오류 발생:", error);
                }
            }
        });
    };

    const onClickList = (e) =>{
        $(e.target.parentElement.parentElement).find(".community-detail-button-list").slideToggle();
    }

    //게시글 수정 로직
    const [isOpenCommunityBoardEditModal, setIsOpenCommunityBoardEditModal] = useState(false);
    const [showCommunityBoardEditModal, setShowCommunityBoardEditModal] = useState(false);

    //수정 버튼 클릭 이벤트
    const onClickEdit = (e) =>{
        console.log("수정");
        setShowCommunityBoardEditModal(true);
    }
    
    //해쉬태그 클릭 시 검색 로직
    const hashtaingClick = (e) => {
        props.setHashtag(e.target.innerText);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    //게시글 신고 로직
    const onClickReport = (e) => {
        swal.fire({
            title: "신고하시겠습니까?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "확인",
            cancelButtonText: "취소",
            customClass: {
                container: 'my-swal-container'
            },
            input: 'text',
            inputPlaceholder: '신고 사유를 입력하세요',
            inputValidator: (value) => {
                if (!value) {
                    return '신고 사유를 입력해주세요';
                }
            }
        }).then((result) => {
            if(result.isConfirmed) {
                const reportData = {
                    bno:props.bno,
                    reportComment:result.value
                }
                axios.post('http://192.168.0.53:8080/api/v1/boards/reports', reportData, {
                    headers: {
                        'Authorization' : `${myCookieValue}`,
                        'Content-Type' : 'application/json; charset=UTF-8'
                    }
                })
                .then(response => {
                    const reportMessage = response.data;
                    if(reportMessage === "이미 신고한 게시글 입니다!") {
                        swal.fire({
                            title:`${reportMessage}`,
                            icon:"warning",
                            confirmButtonText: "확인",
                            customClass: {
                                container: 'my-swal-container'
                            }
                        });
                    } else {
                        swal.fire({
                            title:`${reportMessage}`,
                            icon:"success",
                            confirmButtonText: "확인",
                            customClass: {
                                container: 'my-swal-container'
                            }
                        });
                    }                    
                })
                .catch(err => {
                    swal.fire({
                        title:`${err}`,
                        icon:"error",
                        confirmButtonText: "확인",
                        customClass: {
                            container: 'my-swal-container'
                        }
                    });
                })
            }
        })
        
    }

    return (
        <div className="col-lg-12 col-sm-12">
            <div className="blog-single-box upper">
                <div className="community-detail-button" style={{position:"absolute", width:"37px", padding:"3px", marginRight:"15px", borderRadius:"0px", borderRadius:"0px", right:"10px", top:"20px"}}  onClick={onClickList}>
                    <svg viewBox="0 0 29 7">
                        <circle cx="3.5" cy="3.5" r="3.5"></circle>
                        <circle cx="14.5" cy="3.5" r="3.5"></circle>
                        <circle cx="25.5" cy="3.5" r="3.5"></circle>
                    </svg>
                </div>
                {/**************** 버튼 부분 ******************/}
                <div className="community-detail-button-list" style={{display:"none", position:"absolute", width:"50px", padding:"3px", marginRight:"15px", borderRadius:"0px", borderRadius:"0px", right:"3px", top:"40px", textAlign:"center"}}>
                    {props.loginAccountNo == props.accountNo ? <div onClick={onClickDelete}>삭제</div> : ""}
                    {/*■■■■■■■■■■■■■■■■■■   수정 버튼 모달 활성화 onClick   ■■■■■■■■■■■■■■■■■■*/}
                    {props.loginAccountNo == props.accountNo ? <div onClick={onClickEdit}>수정</div> : ""}
                    {props.loginAccountNo !== props.accountNo ? <div onClick={onClickReport} >신고</div> : ""}
                </div>
                <div className="blog-left" style={{padding:"60px 0px 40px 20px"}}>
                    <div className="blog-icon bi1"  style={{backgroundImage: `url(${props.image})`}} onClick={() => handleButtonClick(props.accountNo)}>
                    </div>
                    <div className='blog-description'>
                        <a href="#"><i className="fas fa-address-card"></i> {props.name}</a>
                        <a href="#"><i className="fas fa-map-marker"></i> {props.address}</a>
                        <span><i className="far fa-calendar-alt"></i> {props.postDate}</span>
                    </div>
                </div>
                <div>
                    <OwlCarousel {...options}>
                        {boardImages.map((image, index) => (
                            /*■■■■■■■■■■■■■■■■■■   이미지 테두리 넣음   ■■■■■■■■■■■■■■■■■■*/
                            <div className="blog-thumb community-image-border" key={index}>
                                <img src={image} alt="" style={{ height: 600 }} />
                                <div className="blog-btn">
                                    <div>{`${index + 1}/${boardImages.length}`}</div>
                                </div>
                            </div>
                        ))}
                    </OwlCarousel>
                </div>
                
                <div className="blog-content">
                    <div style={{display:"flex", height:"35px"}}>
                        <h2><a href="blog-details.html">{props.title}</a></h2>
                    </div>
                    <p>{props.comment}
                    </p>

                    <div className="blog-button">
                        <a onClick={onModal}>read more</a>
                    {/********** 해시태그 위치 **************/}
                    <div className='community-board-hashtag'>
                        {props.category.split(",").map((tag, index) => (
                            <span key={index} onClick={hashtaingClick}>{tag.trim()}</span>
                        ))}
                    </div>
                        <div className="blog-button-container">
                            <div className='blog-button-item'>
                                <img src={require('../images/chat_bubble.png')} onClick={onModal}/>
                            </div>
                            <div className='blog-button-item'>
                                {/* <img src={require('../images/heart.png')}/> */}

                                <div className="heart-icon-wrapper">
                                    <div 
                                        className={`heart-icon ${isLiked ? 'heart-liked ' : ''} ${isBeating ? 'heart-dots heart-beating' : ''}`}
                                        onMouseEnter={handleMouseEnter}
                                        onMouseLeave={handleMouseLeave}
                                        onClick={handleClick}
                                    >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
                                    <path d="M150 57.3C100.2-17.4.7 26.3.7 107.6c0 55 49.7 94.2 87.1 123.8 38.8 30.7 49.8 37.3 62.2 49.8 12.4-12.4 22.8-19.7 62.2-49.8 37.9-29 87.1-69.4 87.1-124.4 0-80.7-99.5-124.4-149.3-49.7z" fillRule="evenodd" clipRule="evenodd"/>
                                    </svg>
                                        <span className="i1"></span>
                                        <span className="i2"></span>
                                        <span className="i3"></span>
                                        <span className="i4"></span>
                                        <span className="i5"></span>
                                        <span className="i6"></span>
                                        <span className="i7"></span>
                                        <span className="i8"></span>
                                        <span className="i1"></span>
                                        <span className="i2"></span>
                                        <span className="i3"></span>
                                        <span className="i4"></span>
                                        <span className="i5"></span>
                                        <span className="i6"></span>
                                        <span className="i7"></span>
                                        <span className="i8"></span>
                                        <span className="i1"></span>
                                        <span className="i2"></span>
                                        <span className="i3"></span>
                                        <span className="i4"></span>
                                        <span className="i5"></span>
                                        <span className="i6"></span>
                                        <span className="i7"></span>
                                        <span className="i8"></span>
                                    </div>
                                </div>
                            </div>
                            <div className='blog-button-item' onClick={scrapHandle}>
                                <img src={require('../images/scrap.png')} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isOpen && (
                <CommunityBoardViewModal_
                open={isOpen}
                onClose={() => {
                setIsOpen(false);
                }}
            >
                <CommunityBoardViewModal 
                    accountNo={props.accountNo}
                    bno={props.bno} 
                    name={props.name}
                    image={props.image}
                    boardImages={boardImages}
                    address={props.address}
                    postDate={props.postDate}
                    likes={props.likes}
                    title={props.title}
                    comment={props.comment}
                    category={props.category}
                    loginAccountNo={props.loginAccountNo}
                    isLiked={isLiked}
                    isBeating={isBeating}
                    handleMouseEnter={handleMouseEnter}
                    handleMouseLeave={handleMouseLeave}
                    handleClick={handleClick}
                    onClickDelete={onClickDelete}
                    scrapHandle={scrapHandle}
                />
            </CommunityBoardViewModal_>
            )}
            {/*■■■■■■■■■■■■■■■■■■ 게시판 수정 모달 ■■■■■■■■■■■■■■■■■■*/}
            {showCommunityBoardEditModal && (
                <CommunityBoardEditModal 
                    open={isOpenCommunityBoardEditModal} 
                    onClose={() => {setShowCommunityBoardEditModal(false);}}
                    bno={props.bno}
                    boardImages={boardImages}
                    setBoardImages={setBoardImages}
                    title={props.title}
                    comment={props.comment}
                    category={props.category}

                />
            )}
                
            
        </div>
    );
    
}

export default CommunityBoard;