import './CommunityFriendListHeader.css';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

function CommunityFriendListHeader({handleFollowerClick}) {
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

    const [friendsInfo, setFriendsInfo] = useState([]);
    const [showFriend, setShowFriend] = useState(false);

    //이미지서버 연결 
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

    //친구 데이터 조회
    useEffect(() => {
        if (showFriend === false) {
            axios.get('http://192.168.0.53:8080/api/v1/boards/friend', {
                headers: {
                    'Authorization': `${myCookieValue}`,
                    'Content-Type': 'application/json; charset=UTF-8'
                }
            })
                .then(response => {
                    Promise.all(response.data.map(async friend => {
                        const image = await imageData(friend.image);
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

    const friendsOption = {
        responsive: {
            0: {
                items: 4
            },
            800: {
                items: 7
            },
            1000: {
                items: 9
            }
        }
    }

    return (
        <div className="row" style={{ marginTop: "-30px", marginBottom: "20px"}}>
            <div className="col-lg-12 col-sm-12 friendlist ">
                <div className="blog-single-box upper friend-icon-box" style={{ background: "#ffffff",borderRadius:'5px',boxShadow: '0px 5px 5px 5px rgba(0, 0, 0, 0.1)' }}>
                    <OwlCarousel items={9} nav={false} dots={false} {...friendsOption}>
                        {friendsInfo.map((friendInfo, index) => (
                            <Follower
                                key={index}
                                image={friendInfo.image}
                                name={friendInfo.name}
                                onClick={() => handleFollowerClick(friendInfo)}
                            />
                        ))}
                    </OwlCarousel>
                </div>
            </div>
        </div>
    );
}

function Follower(props) {
    return (
        <div className='friend-icon-item' onClick={props.onClick}>
            <div className='blog-icon bi1' style={{ boxShadow: "none", backgroundImage: `url(${props.image})`}}>
            </div>
            <div className='blog-icon-description'>
                {props.name}
            </div>
        </div>
    )
}

export default CommunityFriendListHeader;
