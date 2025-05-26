import './GameRoomSearch.css';

function GameRoomSearch() {
    return (
        <div>
            <div className="col-lg-12 col-sm-12" style={{display:"flex", gap:"5%"}}>
                <div className="sidebar-search" style={{width:"88%"}}>
                    <input  className="form-control" type="text" name="search" placeholder="Search...." style={{backgroundColor:"white", color:"black",border:"none", boxShadow:"0px 0px 5px 1px rgba(0,0,0,0.3)"}}/>
                    <button className="button search-button" type="submit"><i className="fas fa-search icon-manipulate" style={{position:"relative"}}></i></button>
                </div>
            </div>
            <select className="game-select">
                <option value="">Select</option>
                <option value="">방 제목</option>
                <option value="">운동 종목</option>
            </select>
        </div>
    );
  }
  
  export default GameRoomSearch;
  




