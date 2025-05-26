import React, { useState,useEffect} from 'react';
import axios from 'axios';
import swal from 'sweetalert2';

const CommunityComment = ({ comment, loginAccountNo, setIsDeleting }) => {

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

    //좋아요 버튼 기능
    const [isCommentLiked, setIsCommentLiked] = useState(false);
    const [isBeating, setIsBeating] = useState(false);
    const [checkLike, setCheckLike] = useState('');
    const likeData = new FormData();

    //마우스가 하트 버튼에 들어왔을 시 애니메이션 true
    const handleMouseEnter = () => {
        setIsBeating(true);
    };

    //마우스가 하트 버튼에서 벗어났으 시 애니메이션 false
    const handleMouseLeave = () => {
        setIsBeating(false);
    };

    //좋아요 누른지 여부 확인
    useEffect((e) => {
        
        axios.get(`http://192.168.0.53:8080/api/v1/comments/like/${comment.bcno}`, {
            headers: {
                'Authorization': `${myCookieValue}`,
                'Content-Type': 'application/json; charset=UTF-8'
            }
        })
        .then(response => {
            setCheckLike(response.data);
            if(response.data == 0) {
                setIsCommentLiked(false);
            } else {
                setIsCommentLiked(true);
            }
        })
        .catch(err => {
            console.log(err)
        });
        
    }, [checkLike]);

    {/*■■■■■■■■■■■■■■■■■■■ 댓글 하트 버튼 따로 이벤트하려면 여기에서 백 작업 넣으면 됨. ■■■■■■■■■■■■■■■■■■■*/}
    const commentLike = (bcno) =>{
        // $(e.target.parentElement.parentElement).find(".heart-color").toggleClass("heart-liked");

        likeData.append('bcno', bcno);
        likeData.append('preState', isCommentLiked ? 1 : 0);

        axios.post('http://192.168.0.53:8080/api/v1/comments/like', likeData, {
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
        setIsCommentLiked(!isCommentLiked);
    }

    // 수정 버튼 기능
    // 수정할 댓글의 내용을 관리하는 상태
    const [editComment, setEditComment] = useState(comment.bcComment);
    // 수정 모드인지 여부를 나타내는 상태
    const [isEditing, setIsEditing] = useState(false);


    // 수정 버튼 클릭 시
    const handleEditClick = () => {
        setIsEditing(true);
    };

    // 입력된 댓글 내용을 상태에 업데이트
    const handleEditInputChange = (e) => {
        setEditComment(e.target.value);
    };

    // 엔터 입력 시 댓글 업데이트
    const editEnter = async (e) => {
        if(e.key === 'Enter') {
            swal.fire({
                title:"수정하시겠습니까?",
                icon:"question",
                showCancelButton: true,
                confirmButtonText: "확인",
                cancelButtonText: "취소",
                customClass: {
                    container: 'my-swal-container'
                }
            })
            .then((result) => {
                if(result.isConfirmed) {
                    try {
                        const updateData = new FormData();
                        updateData.append('bcno', comment.bcno);
                        updateData.append('bcComment',editComment);
                        updateData.append('accountNo', comment.accountNo);
                        axios.put('http://192.168.0.53:8080/api/v1/comments', updateData, {
                            headers: {
                                'Authorization' : `${myCookieValue}`,
                                'Content-Type' : 'application/json; charset=UTF-8'
                            }  
                        })
                        .then(response => {
                            swal.fire({
                                title:"완료되었습니다",
                                icon:"success",
                                confirmButtonText: "확인",
                                customClass: {
                                    container: 'my-swal-container'
                                }
                            });
                            setIsEditing(false);
                            comment.bcComment = editComment;
                        })
                    }
                    catch (err) {
                        console.log(err);
                    }
                } else {
                    setIsEditing(false);
                    setEditComment(comment.bcComment);
                }
            });
        }
    }

    //삭제 이벤트 처리
    const handleDeleteClick = (e) => {
        swal.fire({
            title:"삭제하시겠습니까?",
            icon:"question",
            showCancelButton: true,
            confirmButtonText: "확인",
            cancelButtonText: "취소",
            customClass: {
                container: 'my-swal-container'
            }
        })
        .then(result => {
            if(result.isConfirmed) {
                try {

                    axios.delete(`http://192.168.0.53:8080/api/v1/comments/${comment.bcno}`, {
                        headers: {
                            'Authorization' : `${myCookieValue}`,
                            'Content-Type' : 'application/json; charset=UTF-8'
                        }  
                    })
                    .then(response => {
                        console.log(response.data);
                        swal.fire({
                            title:"완료되었습니다",
                            icon:"success",
                            confirmButtonText: "확인",
                            customClass: {
                                container: 'my-swal-container'
                            }
                        });
                        
                    })
                }
                catch (err) {
                    console.log(err);
                }
            }
            setIsDeleting(true);
        });
    }

    //댓글 신고 로직
    const handleReport = (e) => {
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
            if (result.isConfirmed) {

                const reportData = {
                    bcno:comment.bcno,
                    reportReason: result.value
                }

                axios.post('http://192.168.0.53:8080/api/v1/comment/reports', reportData ,{
                    headers: {
                        'Authorization' : `${myCookieValue}`,
                        'Content-Type' : 'application/json; charset=UTF-8'
                    }
                })
                .then(response => {
                    const reportMessage = response.data;
                    if(reportMessage === "이미 신고한 댓글 입니다!") {
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
        });
    }

    return (
    <>
    <tr>
        <td>{comment.name}</td>
        <td>
            {/* 수정 모드인 경우 */}
            {isEditing ? (
                <input
                    type="text"
                    value={editComment}
                    onChange={handleEditInputChange}
                    onKeyUp={editEnter}
                />
            ) : (
                comment.bcComment
            )}
            {/***************** 게시판 상세보기 버튼. ***************/}
            <div className='comment-icon-layout'>
            <button>
                    {/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ 좋아요 버튼  ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/}
                    <div className="heart-icon-wrapper" >
                        <div 
                            className={`heart-icon ${isCommentLiked ? 'heart-liked' : ''} ${isBeating ? 'heart-dots' : ''}`}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onClick={() => commentLike(comment.bcno)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="-15 0 350 350" style={{transform:"translateY(-3px)"}}>
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
                </button>
                {loginAccountNo === comment.accountNo ? "" : (
                    <button onClick={handleReport}>
                    {/*********** 신고 버튼  ***************/}
                    <img src={require('../images/community_alert.png')}/>
                </button>
                )}
                
                {loginAccountNo === comment.accountNo ? (
                    <button onClick={handleEditClick}>
                        {/*********** 수정 버튼  ***************/}
                        <img src={require('../images/community_write.png')}/>
                    </button>
                ) : ""}
                {loginAccountNo === comment.accountNo ? (
                    <button onClick={handleDeleteClick}>
                        {/*********** 삭제 버튼  ***************/}
                        <img src={require('../images/community_trash.png')}/>
                    </button>
                ) : ""}
                
            </div>
        </td>
        {comment.editDate == null ?
        <td>
            {comment.postDate}

        </td>
        :
        <td>
            {comment.editDate}
        </td>}
    </tr>
    </>
  );
};

export default CommunityComment;
