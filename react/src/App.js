import { BrowserRouter, Routes, Route } from 'react-router-dom';

import {useEffect} from 'react';
import Main from './views/main/Main';
import Community from './views/social/community/Community';
import Recipe from './views/social/recipe/Recipe';

import SignIn from './views/signin/SignIn';
import SignUp from './views/signup/SignUp';

import Messenger from './views/chatting/messenger/Messenger'

import Diet from './views/management/diet/Diet';
import Workout from './views/management/workout/Workout';
import MyPage from './views/mypage/MyPage.js'; 
import Game from './views/game/Game.js';
import GameRoom from './views/game/GameRoom.js'
import FindPassword from './views/findpassword/FindPassword.js';
import Admin from './views/admin/adminmain/AdminMain.js';
import UserList from './views/admin/admincomponent/UserManagement/UserList.js';
import ADblackList from './views/admin/admincomponent/UserManagement/ADblackList.js';
import Dashboard from './views/admin/admincomponent/Dashboard.js';
import ADPosting from './views/admin/admincomponent/UserPosting/ADPosting.js';
import GameM from './views/admin/admincomponent/GameRanking/GameM.js';
import Rcomment from './views/admin/admincomponent/Report/Rcomment.js';
import Rpost from './views/admin/admincomponent/Report/Rpost.js';
import Shop from './views/shop/Shop.js';
import Cart from './views/shop/Cart.js';
import PurchaseList from './views/shop/PurchaseList.js';


import './assets/css/bootstrap.min.css';

import './assets/css/owl.carousel.min.css';

import './assets/css/nivo-slider.css';

import './assets/css/animate.css';

import './assets/css/animated-text.css';

import './assets/css/all.min.css';

import './assets/css/flaticon.css';

import './assets/css/theme-default.css';

import './assets/css/meanmenu.min.css';

import './assets/css/font-awesome.min.css';

import './style.css';

import './assets/css/owl.transitions.css';

import './venobox/venobox.css';

import './assets/css/widget.css';

import './assets/css/responsive.css';
import Medical from './views/medical/Medical.js';


function App() {
  return (
    <div className="App">
        <BrowserRouter>
          <Routes>
            {/*관리자 페이지*/}
            <Route path={'/admin'} element={<Dashboard/>}/>
            <Route path={'/admin/userlist'} element={<UserList/>}/>
            <Route path={'/admin/blacklist'} element={<ADblackList/>}/>
            <Route path={'/admin/adposting'} element={<ADPosting/>}/>
            <Route path={'/admin/gamem'} element={<GameM/>}/> 
            <Route path={'/admin/reportpost'} element={<Rpost/>}/> 
            <Route path={'/admin/reportcomment'} element={<Rcomment/>}/> 


            {/* 메인화면 */}
            <Route path={"/"} element={<Main/>}/>

            {/* 게시판 라우터 commnuity - 게시판   recipe - 찍먹 */}
            <Route path={"/community"} element={<Community/>}/>
            <Route path={"/recipe"} element={<Recipe/>}/>

            {/* 회원가입 라우터 signin - 로그인   signup - 회원가입 */}
            <Route path={"/signin"} element={<SignIn/>}/>
            <Route path={"/signup"} element={<SignUp/>}/>
            <Route path={"/findpassword"} element={<FindPassword/>}/>

            {/* 마이페이지 */}
            <Route path={'/mypage'} element={<MyPage/>}/>

            {/* 회원 관리 메뉴 */}
            <Route path={"/diet"} element={<Diet/>}/>
            <Route path={"/workout"} element={<Workout/>}/>

            {/* 채팅 */}
            <Route path={"/messenger"} element={<Messenger/>}/>

            {/*게임 페이지*/}
            <Route path={"/game"} element={<Game/>}/>
            <Route path={"/game/room"} element={<GameRoom/>}/>
            
            {/*쇼핑몰 페이지*/}
            <Route path={"/shop"} element={<Shop/>}/>
            <Route path={"/cart"} element={<Cart/>}/>
            <Route path={"/purchaselist"} element={<PurchaseList/>}/>

            {/*메디컬 판단 페이지*/}
            <Route path={"/medical"} element={<Medical/>}/>
          </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
