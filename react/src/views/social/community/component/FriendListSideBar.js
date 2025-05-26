import React, { useState } from 'react';
import './FriendListSideBar.css';
import 'material-symbols';

const FriendListSideBar = () => {
  const [friendsShown, setFriendsShown] = useState(true);
  const [requestsShown, setRequestsShown] = useState(false);
  const [blacklistShown, setBlacklistShown] = useState(false);


/********** 임시 데이타 **********/
  const friends = [
    { name: 'Ronald Castellon', avatar: 'https://www.fakepersongenerator.com/Face/male/male20161083938332337.jpg' },
    { name: 'Lee Smith', avatar: 'https://www.fakepersongenerator.com/Face/male/male20151083712944519.jpg' },
    { name: 'Tina McMullen', avatar: 'https://www.fakepersongenerator.com/Face/female/female1022946652252.jpg' }
  ];

  const requests = [
    { name: 'Eddie Shifflett', avatar: 'https://www.fakepersongenerator.com/Face/female/female20161024815101136.jpg' },
    { name: 'Winifred Imes', avatar: 'https://www.fakepersongenerator.com/Face/male/male108460114313.jpg' }
  ];

  const blacklist = [
    { name: 'Stephen K Smith', avatar: 'https://www.fakepersongenerator.com/Face/male/male1084388444824.jpg' },
    { name: 'Sonia K Willis', avatar: 'https://www.fakepersongenerator.com/Face/female/female20141023850800049.jpg' }
  ];

/********** 임시 데이타 **********/

  const people = friendsShown ? friends : requestsShown ? requests : blacklist;

  const setFirst = () => {
    setFriendsShown(true);
    setRequestsShown(false);
    setBlacklistShown(false);
  };

  const setSecond = () => {
    setFriendsShown(false);
    setRequestsShown(true);
    setBlacklistShown(false);
  };

  const setThird = () => {
    setFriendsShown(false);
    setRequestsShown(false);
    setBlacklistShown(true);
  };

  return (
    <div className='FLbody'>
        <div className="showcase">
            <h2>Friend list</h2>
            <div className="tabgroup">
                <button className={`tab ${friendsShown ? 'tab-active' : ''}`} onClick={setFirst}>
                Friends {/*({friends.length})*/}
                </button>
                <button className={`tab ${requestsShown ? 'tab-active' : ''}`} onClick={setSecond}>
                Requests {/*({requests.length})*/}
                </button>
                <button className={`tab ${blacklistShown ? 'tab-active' : ''}`} onClick={setThird}>
                Blacklist {/*({blacklist.length})*/}
                </button>
            </div>

            <ul className="person-list">
                {people.map((person, index) => (
                <li key={index}>
                    <a className="person-item" href="#">
                    <img className="person-avatar" src={person.avatar} alt={person.name} />
                    <span className="person-name">{person.name}</span>
                    <span className="material-symbols-rounded">delete</span>
                    </a>
                </li>
                ))}
            </ul>
        </div>
    </div>
  );
};

export default FriendListSideBar;