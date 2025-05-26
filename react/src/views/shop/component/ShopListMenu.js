import './ShopListMenu.css';
import Img_Potato from './images/potato.png';


function ShopListMenu() {
    return (
        <div className="container shop-list-header">
        <div className="row">
            <div className="col-lg-12 col-sm-12">
                <div className="portfolio_nav text-center">
                    <div className="food-div-layout">
                        <div className="food-div">
                            <i className="fa-solid fa-list"></i>
                            <span>전체</span>
                        </div>
                        <div className="food-div">
                            <i className="fa-solid fa-drumstick-bite"></i>
                            <span>닭 가슴살</span>
                        </div>
                        <div className="food-div">
                            <i class="fa-solid fa-plate-wheat"></i>
                            <span>고구마, 감자</span>
                        </div>
                        <div className="food-div">
                            <i class="fa-solid fa-fish"></i>
                            <span>생선(미정)</span>
                        </div>
                        <div className="food-div">
                            <i className='fa fa-shopping-cart'></i>
                            <span>다른 음식 메뉴</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
  }
  
  export default ShopListMenu;
  
  