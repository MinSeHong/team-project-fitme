import React, { useEffect, useState } from 'react';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import './CommunityBoardWriteModal.css';
import axios from 'axios';
import swal from 'sweetalert2';

function CommunityBoardWriteModal(props) {
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
    const options = {
        margin: 10,
        loop: true,
        items: 1,
        dots: false,
        autoplay: true,
        autoplayTimeout: 4500,
        smartSpeed: 450,
    };

    //해쉬태그
    const [hashtags, setHashtags] = useState([]);
    const [inputValue, setInputValue] = useState('');

    const handleChange = (e) => {
        setInputValue(e.target.value);
    }

    const handleKeyDown = (e) => {
        e.preventDefault();
        if(e.code === 'Enter') {
            if(!(inputValue === ''))  {
                if(!hashtags.includes(inputValue)) {
                setHashtags(pre => [...pre, inputValue]);
                setInputValue("");
                
                }
            }
        }
        
    }

    useEffect(() => {
        
    }, [hashtags])

    //게시글 등록
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [boardImages, setBoardImages] = useState([]);
    const [posts, setPosts] = useState({
        accountNo: `${props.accountNo}`,
        title: "",
        boardComment: "",
        address: "서울특별시 서초구 서초대로77길 41, 4층 (서초동, 대동Ⅱ)",
        boardCategory: [],
        uploads: ''
    });
    const [inputHidden, setInputHidden] = useState(false); 

    function convertToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    const handleFileChange = async (event) => {
        const files = event.target.files;
        const fileArray = Array.from(files);
    
        const base64Array = [];
    
        for (const file of fileArray) {
            const base64String = await convertToBase64(file);
            base64Array.push(base64String);
        }
    
        setPosts(prevPosts => ({
            ...prevPosts,
            uploads: base64Array 
        }));
    
        setSelectedFiles(fileArray);
        setInputHidden(true); 
    };
    
    const onClickButton = async (e) => {

        e.preventDefault();
        
        hashtags.forEach(hashtag => {
            posts.boardCategory += `#${hashtag},`
        }) 

        setPosts({
            ...posts
        });

        await swal.fire({
            title: "등록하시겠습니까?",
            icon: "question",
            showCancelButton: true, // 확인 취소 버튼 노출
            confirmButtonText: "확인", // 확인 버튼 텍스트
            cancelButtonText: "취소", // 취소 버튼 텍스트
            customClass: {
                container: 'my-swal-container'
            }
        }).then(async (result) => {
            if (result.isConfirmed) { // 확인 버튼이 클릭되었는지 확인
                // 확인 버튼이 클릭되었을 때의 동작
                try {
                    const data = new FormData();
                    for (const file of posts.uploads) {
                        const base64 = file.split(',')[1];
                        data.append('uploads', base64);
                    }
                        
                    const imageResponse = await axios.post('http://192.168.0.53:5050/file/uploads', data, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
        
                    setBoardImages(imageResponse.data);
        
                    const springResponse = await axios.post('http://192.168.0.53:8080/api/v1/boards', {
                        accountNo: props.accountNo,
                        title: posts.title,
                        boardComment: posts.boardComment,
                        boardCategory: posts.boardCategory,
                        address: posts.address,
                        boardImages: imageResponse.data 
                    },{
                        headers: {
                            'Authorization' : `${myCookieValue}`,
                            'Content-Type' : 'application/json; charset=UTF-8'
                        }
                    });
        
                    props.setShowModal(false);

                } catch (error) {
                    console.error(error);
                }
            }
        });
    };




    return (
        <div className="col-lg-12 col-sm-12">
            <form className="blog-single-box upper" style={{ backgroundColor: "#F6F4EC", height:"910px"}} onSubmit={onClickButton}>
                <div style={{position: "relative", width:"92%", height:"500px", margin:"auto", marginTop:"30px", background:"white", borderRadius:"5px", border:"1px solid #c2cfdb"}}>
                    {!inputHidden && (
                        <>
                            <label htmlFor="file" className='blog-image-button'>Images</label>
                            <input type="file" id="file" style={{ display: "none" }} multiple onChange={handleFileChange} />
                        </>
                    )}
                    <OwlCarousel {...options}>
                        {selectedFiles.map((file, index) => (
                            <div className="blog-thumb" key={index}>
                                <img src={URL.createObjectURL(file)} alt="" style={{ height: 500 }} />
                                <div className="blog-btn">
                                    <div>{`${index + 1}/${selectedFiles.length}`}</div>
                                </div>
                            </div>
                        ))}
                    </OwlCarousel>
                </div>
                <div className="blog-content" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div>
                        <input type="text" style={{ width: "100%", textAlign: "center" }} placeholder='제목을 입력하세요' name='title' onChange={(e) => setPosts({ ...posts, title: e.target.value })} />
                    </div>
                    <div>
                        <textarea style={{ width: "100%", height: "200px" }} name='boardComment' onChange={(e) => setPosts({ ...posts, boardComment: e.target.value })}></textarea>
                    </div>

                    {/********** 해시 태그 ***************** appeend 할 부분*/}
                    <div className="community-hashtag">
                        {hashtags.map(hashtag => (
                            <span>{hashtag}</span>
                        ))}
                    </div>

                    <div style={{ display: "flex", flexDirection: "row-reverse", gap: "10px" }}>
                        <button className="community-write-button" style={{width:"160px"}}>Back</button>
                        <button className="community-write-button" style={{width:"160px"}}>Post</button>
                        <input type="text" className="community-modal-select" placeholder='HashTag' onChange={handleChange} onKeyDown={handleKeyDown}>
                        </input>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default CommunityBoardWriteModal;