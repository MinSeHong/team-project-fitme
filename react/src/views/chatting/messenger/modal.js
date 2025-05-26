import React, { useEffect, useState } from "react";
import './modal.css';
import axios from "axios";

var chatCheck = null;

function getCookie(name) { //로그인 여부 확인
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(name + '=')) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
}

//이미지서버 연결 
async function imageData(code){
  return await new Promise((resolve,reject)=>{
  try{
      axios.get(`http://192.168.0.53:5050/image/${code}`)
      .then((response)=>{
          resolve("data:image/png;base64,"+response.data['image']);
      })
  }
  catch(err){reject(err)};
  },2000);
}

function Modal(props) {
  const myCookieValue = getCookie('Authorization');
  const [friendsInfo, setFriendsInfo] = useState([]);
  const [showFriend, setShowFriend] = useState(false);

  //친구 리스트
  useEffect(() => {
    if (showFriend === false) {
      chatCheck = props.addChattingRoom == null? null : props.addChattingRoom.value; //방생성 0, 방초대 null
      console.log('setChatRoomNo', chatCheck);

      if(props.chatRoomNo == null && chatCheck == null) return;

      axios.get(`/api/v1/chat/list/room/friends/${chatCheck == null ? props.chatRoomNo : 0}`, {
      // axios.get('/api/v1/boards/friend', {
          headers: {
              'Authorization': `${myCookieValue}`,
              'Content-Type': 'application/json; charset=UTF-8'
          }
      })
      .then(response => {
          // console.log(response.data);
          Promise.all(response.data.map(async friend => {
              const image = await imageData(friend.image == null ? 41 :friend.image);
              friend.image = image;
              return friend;
          }))
          .then(updatedFriendsInfo => {
              setFriendsInfo(updatedFriendsInfo);
              setShowFriend(true);
          })
          .catch(error => console.log(error));
      })
      .catch(error => console.log(error));
    } 
  }, [showFriend]);

  const [selectedFriends, setSelectedFriends] = useState([]); // 선택한 친구 목록 상태 추가

  useEffect(() => {
    // modal이 열릴 때 이벤트 핸들러 추가
    const searchInput = document.querySelector('.search-container input[type="text"]');
    const handleSearch = (event) => {
      const searchText = event.target.value.toLowerCase();
      const friendItems = document.querySelectorAll('.friend-item');
      friendItems.forEach(item => {
        const friendName = item.querySelector('.friend-name').textContent.toLowerCase();
        if (friendName.includes(searchText)) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    };
    searchInput.addEventListener('input', handleSearch);

    // 모달이 닫힐 때 이벤트 핸들러 제거
    return () => {
      searchInput.removeEventListener('input', handleSearch);
    };
  }, []);

  // 선택한 친구를 추가하거나 삭제하는 함수
  const handleFriendToggle = ( friendAccountNo,friendName, friendImage, isChecked) => {
    if (isChecked) {
      setSelectedFriends([...selectedFriends, { name: friendName, image: friendImage, accountNo: friendAccountNo}]);
    } else {
      setSelectedFriends(selectedFriends.filter(friend => friend.name !== friendName));
    }
  };
  // 선택한 친구 삭제 및 해당 친구의 체크박스 선택 해제 함수
  const handleRemoveFriend = (friendAccountNo) => {
    setSelectedFriends(selectedFriends.filter(friend => friend.accountNo !== friendAccountNo));
    // 해당 친구의 체크박스 선택 해제
    const friendItems = document.querySelectorAll('.friend-item');
    friendItems.forEach(item => {
      const accountNoElement = item.querySelector('.friend-accountNo');
      if (accountNoElement && accountNoElement.value == friendAccountNo) {
        const friendCheckbox = item.querySelector('.friend-checkbox');
        if (friendCheckbox) friendCheckbox.checked = false;
      }
    });
  };

  //채팅방 생성
  // useEffect(()=>{
  //   console.log('selectedFriends',chatRoomMember);
  // },[chatRoomMember])
  function selectChatRoom(){
    // console.log('selectedFriends',selectedFriends);

    const data = new FormData();
    data.append('chattingNo', chatCheck == null ? props.chatRoomNo : 0);
    // console.log('accountNo',selectedFriends.length);
    if(selectedFriends != null && selectedFriends.length > 1){
      selectedFriends.forEach((e)=>{
        data.append('friends',e['accountNo']);
      })
    }
    if(selectedFriends != null && selectedFriends.length == 1){
      // console.log('accountNo',selectedFriends[0]);
      data.append('accountNo',selectedFriends[0].accountNo);
    }
    axios.post(`/api/v1/chat/list/room/friends`,data,{
      headers: {
        'Authorization': `${myCookieValue}`,
        'Content-Type': 'application/json; charset=UTF-8'
    }
    })
    .then(res=>{
      console.log('res.data',res.data)
      props.onCheck(['확인',props.chatRoomNo]);
    });

    props.onClose();
    
  }


  return (
    <div className="Modal" onMouseDown={props.onClose}>
      <div className="modalBody" onMouseDown={(e) => e.stopPropagation()} style={{ width: '30%' }}>
        <button id="modalCloseBtn" onMouseDown={props.onClose}>
          ✖
        </button>
        {props.children}
        <div className="selected-friends">
          <ul>
            {selectedFriends.map((friend, index) => (
              <div key={index}>
                <input type="hidden" value={friend.accountNo} />
                <div className="sfprofile">
                  <div className="finfo">
                    <span className="fname">{friend.name}</span>
                    <button className="remove-btn" onClick={() => handleRemoveFriend(friend.accountNo)}>✖</button>
                  </div>
                </div>
              </div>
            ))}
          </ul>
          {selectedFriends.length != 0 ? <button onClick={()=>selectChatRoom()}>추가</button> : ''}
        </div>
        <div className="f-search">
          <div className="search-container">
            <input type="text" placeholder="친구를 검색하세요..." />
            <button>검색</button>
          </div>
        </div>
        <div className="friend-list">
          <h2>친구 목록</h2>
          <ul>
            <li>
              {friendsInfo.map((friend)=>(
                <div className="friend-item">
                  <input type='hidden' className="friend-accountNo" value={friend.accountNo} />
                  <img src={friend.image} alt="친구 이미지" />
                  <div className="friend-info">
                    <span className="friend-name">{friend.name}</span>
                    <input type="checkbox" className="friend-checkbox" onChange={(e) => handleFriendToggle(friend.accountNo,friend.name, friend.image, e.target.checked)} />
                  </div>
                </div>
              ))}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Modal;