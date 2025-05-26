import $ from 'jquery';
import React, { useState} from 'react';
import '../adminstyle/Acss/LeftSidebar.css'
import '../adminstyle/Acss/bootstrap.min.css';
import '../adminstyle/Acss/icons.css';
import '../adminstyle/Acss/icons.css.map';
import '../adminstyle/Acss/style.css.map';
import '../adminstyle/Acss/typicons.css';
import '../adminstyle/Acss/typicons.css.map';

import '../adminstyle/Aheader.css';





    $(document).ready(function() {
        $('.has_sub').click(function() {
            $(this).children('ul').slideToggle();
        });
    });

function LeftSidebar(){
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };
    return(

        <div className="left side-menu">
            <button type="button" className="button-menu-mobile button-menu-mobile-topbar open-left waves-effect">
                <i className="ion-close"></i>
            </button>

            
            <div class="topbar-left" style={{height:'73px'}}>
                <div className="top-content tcon">
                    <i className="fa fa-cog fa-2x"/>
                    <h2>FitMe</h2>
                </div>
            </div>

            <div className="sidebar-user">
                <img src="assets/images/users/avatar-6.jpg" alt="사진" className="rounded-circle img-thumbnail mb-1"/>
                <h6 className="">프로필 이름 </h6>                               
            </div>

            <div className="sidebar-inner slimscrollleft">

                <div id="sidebar-menu">
                    <ul>
                        <li className="menu-title">메뉴</li>

                        <li>
                            <a href="/admin" className="waves-effect">
                                <i class="fas fa-th-large"></i>
                                <span> 대시보드</span>
                            </a>
                        </li>
                        <li className="has_sub">
                            <a href="/admin/gamem" className="waves-effect"><i className="fas fa-gamepad"></i><span> 게임관리 </span></a>
                        </li>
                        <li className="has_sub">
                            <a href="/admin/adposting" className="waves-effect"><i className="fas fa-file-alt"></i><span>게시글 관리</span></a>
                        </li>

                        <li className="has_sub">
                            <a href="javascript:void(0);" className="waves-effect">
                                <i className="fas fa-users-cog"></i> 
                                <span> 회원 관리 </span> 
                                <span className="float-right">
                                    <i className="fas fa-chevron-down"></i> {/* 아래쪽 화살표 아이콘 */}
                                </span>
                            </a>
                            <ul className="list-unstyled">
                                <li><a href="/admin/userlist">회원 목록 관리</a></li>
                                <li><a href="/admin/blacklist">블랙리스트 관리</a></li>                                                        
                            </ul>
                        </li>

                        <li className="has_sub">
                            <a href="javascript:void(0);" className="waves-effect">
                                <i className="fas fa-exclamation-triangle"></i> 
                                <span>신고 관리</span> 
                                <span className="float-right">
                                <i className="fas fa-chevron-down"></i> {/* 아래쪽 화살표 아이콘 */}
                                </span>
                            </a>
                            <ul className="list-unstyled">                                   
                                <li><a href="/admin/reportpost">게시글 신고 관리</a></li>
                                <li><a href="/admin/reportcomment">댓글 신고 관리</a></li>
                            </ul>
                        </li>

                        <li className="has_sub">
                            <a href="javascript:void(0);" className="waves-effect">
                                <i className="fas fa-comment"></i>
                                <span> 댓글 관리 </span> 
                                <span className="float-right">
                                    <i className="fas fa-chevron-down"></i> {/* 아래쪽 화살표 아이콘 */}
                                </span>
                            </a>
                            <ul className="list-unstyled">
                                <li><a href="tables-basic.html">Basic Tables</a></li>
                                <li><a href="tables-datatable.html">Data Table</a></li>                                  
                            </ul>
                        </li>
                    </ul>
                </div>
                <div className="clearfix"></div>
            </div> 
        </div>       

    );
}
export default LeftSidebar;