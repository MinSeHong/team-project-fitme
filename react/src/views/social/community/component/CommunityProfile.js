import { useState } from "react";
import axios from "axios";

import 'material-symbols';// npm install material-symbols@latest

function CommunityProfile(props) {

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

    const [sendFollow, setSendFollow] = useState([]);

    // Follow 버튼 클릭 이벤트
    const handleAddFriendClick = () => {
        const opponentNo = props.accountNo;
        
        axios.post(`http://192.168.0.53:8080/api/v1/boards/follow`, opponentNo , {
            headers: {
                'Authorization': `${myCookieValue}`,
                'Content-Type': 'application/json; charset=UTF-8'
            }
        })
        .then(response => {
            console.log('친구 추가 요청이 성공했습니다.');
        })
        .catch(error => {
            console.error('친구 추가 요청이 실패했습니다.', error);
        });
    };

    const handleRefreshClick = () => {
        props.setRefresh(!props.refresh);
    }


    return (
        <div className="col-lg-12 col-sm-12" >
            <div className="blog-single-box upper" style={{padding:"10px 0px"}}>
            {/******** ★ 새로고침 버튼 ★  ********/}
            <button className="community-refresh-button" style={{background:'none',border:'none',position:"absolute", right:"5px", bottom:"5px", width:"30px", height:"30px", borderRadius:"50%", fontSize:"25px", lineHeight:"20px"}} onClick={handleRefreshClick} >
                <span className="material-symbols-rounded" id='open-button' style={{position:"absolute",right:'-4px',bottom:'-4px'}}>refresh</span></button>    
                <div className="blog-left bl1" style={{padding:"60px 0px"}}>
                    <div style={{display:"flex"}}>
                        <div className="blog-icon bi1" style={{backgroundImage: `url(${props.image})`}}>
                        </div>
                        <div className='blog-description'>
                            <a href="#">{props.name}</a>
                            {/* <a href="#">{props.address}</a> */}

                            <span>{props.enrollDate}</span>
                        </div>
                    </div>

                    <div className='blog-post-detail'>
                            <div className='blog-post-description'>
                                <div className="blog-post-description-title">POST</div>
                                <div className="blog-post-description-content">{props.postCount}</div>
                            </div>
                            <div className='blog-post-description'>
                                <div className="blog-post-description-title">Follower</div>
                                <div className="blog-post-description-content">{props.follower}</div>
                                {props.realation || props.loginAccountNo == props.accountNo ? "" : <button className="blog-post-description-button" onClick={handleAddFriendClick}>Add Friend</button>}
                            </div>
                            <div className='blog-post-description'>
                                <div className="blog-post-description-title">Following</div>
                                <div className="blog-post-description-content">{props.following}</div>
                                <button className="blog-post-description-button">DM</button>
                            </div>
                        </div>
                </div>
            </div>
        </div>
    );
  }
  
  export default CommunityProfile;
  




