import React, { useState,useEffect} from 'react';
import axios from 'axios';
import $ from 'jquery';

import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import './CommunityBoardViewModal.css';
import CommunityComment from './CommunityComment';

function CommunityBoardViewModal(props) {

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

    //댓글 조회
    const [comments, setComments] = useState([]);

    //댓글 등록
    const [postComment, setPostComment] = useState({
        bno:'',
        accountNo:'',
        bcComment:''
    });
    //input 태그 안의 값 저장용
    const [inputValue, setInputValue] = useState('');

    const [updataComment, setUpdataComment] = useState(false);

    //댓글 삭제 상태값 저장용 - 댓글 삭제 시 랜더링
    const [isDeleting, setIsDeleting] = useState(false);

    const options = {
        margin:10,
        loop: true,
        items: 1,
        dots:false,
        autoplay:true,
        autoplayTimeout: 4500,
        smartSpeed: 450,
    };

    

    const onClickList1 = (e) =>{
        $(e.target.parentElement.parentElement).find(".community-detail-button-list").slideToggle();
    }

    //게시글 댓글 전체 조회
    useEffect(() => {
        axios.get(`http://192.168.0.53:8080/api/v1/comments/${props.bno}`, {
            headers: {
                'Authorization' : `${myCookieValue}`,
                'Content-Type' : 'application/json; charset=UTF-8'
            }
        })
        .then(response => {
            setComments(response.data);
            setIsDeleting(false);
        })
    },[postComment,updataComment, isDeleting]);

    //********댓글 등록 메소드**************//
    //input 태그에 입력된 값 저장
    const handleInputChange = (e) => {
        setInputValue(e.target.value); // 입력된 값으로 상태 업데이트
    };

    

    //댓글 등록 
    const handlePost =(e) => {
        setPostComment({
            bno:props.bno,
            accountNo:props.loginAccountNo,
            bcComment:inputValue
        });
        setInputValue('');
        
    }

    //댓글 등록
    useEffect(() => {
        if (!postComment.bno || !postComment.accountNo || !postComment.bcComment) {
            // 필요한 데이터가 아직 모두 준비되지 않았을 경우 무시
            return;
        }
    
        axios.post('http://192.168.0.53:8080/api/v1/comments', postComment, {
            headers: {
                'Authorization' : `${myCookieValue}`,
                'Content-Type' : 'application/json; charset=UTF-8'
            }
        })
        .then(response => {
            setUpdataComment(!updataComment);
            setInputValue('');
        })
        .catch(error => {
            console.error('Error while posting comment:', error);
        });
    }, [postComment]);


    {/*■■■■■■■■■■■■■■■■■■■ 수정 버튼(임시) ■■■■■■■■■■■■■■■■■■■*/}
    const [isOpenCommunityBoardEditModal, setIsOpenCommunityBoardEditModal] = useState(false);
    const [showCommunityBoardEditModal, setShowCommunityBoardEditModal] = useState(false);


    {/*■■■■■■■■■■■■■■■■■■■ 수정 모달 불러오기 위해 임시로 만든 것(미완성) ■■■■■■■■■■■■■■■■■■■*/}
    const onClickEdit = (e) =>{
        console.log("수정");
        setShowCommunityBoardEditModal(true);
    }

    



    return (
        <div className='row justify-content-md-center' style={{borderRadius:"5px", paddingTop:"20px", height:"105%"}}>
            <div className="col-lg-6 col-sm-6 scrolling" style={{height:"95%", overflow:"scroll", backgroundColor:"white", borderRadius:"5px"}}> 
                <div className="community-detail-button" style={{position:"absolute", width:"37px", padding:"3px", marginRight:"15px", borderRadius:"0px", borderRadius:"0px", right:"10px", top:"30px", zIndex:"1"}}  onClick={onClickList1}>
                    <svg viewBox="0 0 29 7">
                        <circle cx="3.5" cy="3.5" r="3.5"></circle>
                        <circle cx="14.5" cy="3.5" r="3.5"></circle>
                        <circle cx="25.5" cy="3.5" r="3.5"></circle>
                    </svg>
                </div>
                {/**************** 버튼 부분 ******************/}
                <div className="community-detail-button-list" style={{display:"none", backgroundColor:"white", position:"absolute", width:"50px", padding:"3px", marginRight:"15px", borderRadius:"0px", borderRadius:"0px", right:"3px", top:"40px", textAlign:"center", zIndex:"2",transform:"translateY(15px)"}}>
                    {props.loginAccountNo === props.accountNo ? <div onClick={props.onClickDelete}>삭제</div> : "" }
                    {props.loginAccountNo === props.accountNo ? <div>수정</div> : "" }
                    {props.loginAccountNo !== props.accountNo ? <div>신고</div> : "" }
                </div>

                <div className="blog-single-box upper" style={{height:"93%", padding:"0px", backgroundColor:"white", marginTop:"20px"}}>
                    <div className="blog-left" style={{padding:"60px 0px 40px 20px"}}>
                        <div className="blog-icon bi1" style={{backgroundImage: `url(${props.image})`}}>
                        </div>
                        <div className='blog-description'>
                            <a href="#"><i className="fas fa-address-card community-icon"></i>{props.name}</a>
                            <a href="#"><i className="fas fa-map-marker community-icon"></i>{props.address}</a>
                            <span><i className="far fa-calendar-alt community-icon"></i>{props.postDate}</span>
                        </div>
                    </div>
                    {/*■■■■■■■■■■■■■■■■■■■ 이미지 영역 border ■■■■■■■■■■■■■■■■■■■*/}
                    <div className='community-image-border'>
                        <OwlCarousel {...options}>
                            {props.boardImages.map((image, index) => (
                                <div className="blog-thumb" key={index}>
                                    <img src={image} alt="" style={{ height: 600 }} />
                                    <div className="blog-btn">
                                        <div>{`${index + 1}/${props.boardImages.length}`}</div>
                                    </div>
                                </div>
                            ))}
                        </OwlCarousel>
                    </div>
                    
                    {/*■■■■■■■■■■■■■■■■■■■ style ■■■■■■■■■■■■■■■■■■■*/}
                    <div className="blog-content" style={{marginTop:"20px", paddingTop:"10px", paddingBottom:"0px"}}>
                        <h2 style={{textAlign:"left", padding:"0px", transform:"translateY(15px)"}}>{props.title}</h2>
                        
                        {/*■■■■■■■■■■■■■■■■■■■ <p></p> style ■■■■■■■■■■■■■■■■■■■*/}
                        <p style={{textAlign:"left"}}>
                            {props.comment}
                        </p>

                        <div className='community-board-hashtag' style={{transform:"translateX(-20px)", width:"100%"}}>
                            {props.category.split(",").map((tag, index) => (
                                <span key={index}>{tag.trim()}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-lg-6 col-sm-6" style={{height:"95%"}}>
                <div className="blog-single-box upper" style={{height:"100%", backgroundColor:"#F6F4EC"}}>
                    <div className="blog-content" style={{height:"90%"}}>
                        <div className='blog-comment'>
                            <table className="blog-comment-table">
                                {comments.map(comment => (
                                    <CommunityComment
                                        key={comment.bcno}
                                        comment={comment}
                                        loginAccountNo={props.loginAccountNo}
                                        setIsDeleting={setIsDeleting}
                                    />
                                ))}
                            </table>
                        </div>
                    </div>
                    <div className="blog-content">
                        <div className="blog-button">
                        <input type="text" style={{width:"80%", height:"45px", borderRadius:"5px", border:"none", boxShadow:"0px 0px 5px 1px rgba(0,0,0,0.1)"}} onChange={handleInputChange} value={inputValue}></input>
                        <button type="submit" style={{position:"absolute", right:"140px", borderRadius:"5px", backgroundColor:"#F6F6F6", border:"none", boxShadow:"0px 0px 5px 1px rgba(0,0,0,0.2)"}} onClick={handlePost}>submit</button>
                        <div className="blog-button-container" style={{width: "90px"}}>
                            <div className='blog-button-item'>
                                <div className="heart-icon-wrapper">
                                    <div 
                                        className={`heart-icon ${props.isLiked ? 'heart-liked' : ''} ${props.isBeating ? 'heart-dots heart-beating' : ''}`}
                                        onMouseEnter={props.handleMouseEnter}
                                        onMouseLeave={props.handleMouseLeave}
                                        onClick={props.handleClick}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
                                        <path d="M150 57.3C100.2-17.4.7 26.3.7 107.6c0 55 49.7 94.2 87.1 123.8 38.8 30.7 49.8 37.3 62.2 49.8 12.4-12.4 22.8-19.7 62.2-49.8 37.9-29 87.1-69.4 87.1-124.4 0-80.7-99.5-124.4-149.3-49.7z" fill-rule="evenodd" clip-rule="evenodd"/>
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
                                <div className='blog-button-item'>
                                    <img src={require('../images/scrap.png')} onClick={props.scrapHandle}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
  }
  
  export default CommunityBoardViewModal;