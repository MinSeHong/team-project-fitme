import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Gmodal.css';
import './Pmodal.css';
import Swal from 'sweetalert2';

async function imageData(code) {
  return await new Promise((resolve, reject) => {
    try {
      axios
        .get(`http://192.168.0.53:5050/image/${code == null ? 41 : code}`)
        .then((response) => {
          resolve('data:image/png;base64,' + response.data['image']);
        });
    } catch (err) {
      reject(err);
    }
  }, 2000);
}

async function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

function Modal(props) {

  
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
  
  const [formData, setFormData] = useState({
    nickname: '',
    gameImage: null,
  });

  const myCookieValue = getCookie('Authorization');
  const [previewImage, setPreviewImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  
  useEffect(() => {
    setFormData({
      nickname: props.nickname,
      gameImage: formData.gameImage
    });

  }, [props]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      setImageFile(file);
    } else {
      setPreviewImage(null);
      setImageFile(null);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const updatedFormData = {
        accountNo: props.accountNo,
        nickname: formData.nickname,
        gameImage: formData.gameImage 
      };
  
      if (imageFile) {
        // 이미지 파일이 있는 경우 처리
        // 이미지를 업로드하고 업로드된 이미지의 URL을 formData에 추가
        const imageData = await getBase64(imageFile);
        const imageBase64Data = imageData.split(',')[1];
        const imageDataForm = new FormData();
        imageDataForm.append('uploads', imageBase64Data);
        
        // 이미지를 업로드합니다.
        const response = await axios.post('http://192.168.0.53:5050/fileupload', imageDataForm, {
          headers: {
            'Authorization': `${getCookie('Authorization')}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        // 업로드된 이미지 데이터를 formData에 추가합니다.
        updatedFormData.gameImage = response.data; // 이미지 업로드 후 서버에서 반환된 값
      }
  
      // 게임 계정 정보를 서버로 전송합니다.
      await axios.put(`http://192.168.0.53:8080/api/v1/games/account/${props.accountNo}`, updatedFormData, {
        headers: {
          'Authorization': `${myCookieValue}`,
          'Content-Type': 'application/json'
        }
      });

      // 수정이 완료되었을 때 SweetAlert2 알림을 띄웁니다.
    Swal.fire({
      icon: 'success',
      title: '수정이 완료되었습니다.',
      showConfirmButton: true,
      customClass:{
        container:'m-sweet-con Mwicon',
        icon: 'm-sweet-icon',
      },
      allowOutsideClick: false, // 모달 외부 클릭으로 닫히지 않도록 설정
      allowEscapeKey: false // ESC 키로 모달 닫히지 않도록 설정
    }).then(()=>{
      props.onClose();
    })
    } catch (error) {
      //console.error('처리 중 오류가 발생했습니다:', error);
      Swal.fire({
        icon: 'error',
        title: '수정에 실패했습니다.',
        html: '처리 중 오류가 발생했습니다.<br> 관리자에게 문의하세요',
        showConfirmButton: true,
        customClass: {
          container:'m-sweet-con',
          icon: 'm-sweet-danger MswdR',
        },
        allowOutsideClick: false, // 모달 외부 클릭으로 닫히지 않도록 설정
        allowEscapeKey: false // ESC 키로 모달 닫히지 않도록 설정
      }).then(()=>{
        props.onClose();
      })
    }
  };
  
  
  
  return (
    <div className="Modal MB" onMouseDown={props.onClose}>
      <div className="modalBody" onMouseDown={(e) => e.stopPropagation()} style={{ width: '450px', height:"530px", overflow:"hidden"}}>
        <button id="modalCloseBtn" onMouseDown={props.onClose}>
          ✖
        </button>
        <div className='modal-profile-edit-title' style={{marginBottom:"30px"}}>게임 프로필 수정</div>
        <form onSubmit={handleSubmit} style={{border:"1px solid rgba(0,0,0,0.2)", backgroundColor:"rgba(0,0,0,0.05)",  borderRadius:"5px", display:"flex", flexDirection:"column", alignItems:"center"}}>
          <label className="profile-picture-container PPCR" style={{margin:"auto", textAlign:"center", width:"230px", height:"200px",position:"relative", marginTop:"20px"}}>
            <div>
              <input type="file" name="gameImage" className="profilePicture " onChange={handleFileChange}/>
              {previewImage ? (
                <img src={previewImage} alt="프로필 사진" className="profile-picture" />
              ) : (
                <span style={{display:'block', left:"0px", right:"0px", textAlign:"center" ,margin:"auto", marginTop:"80px",position:"absolute",color:'#888'}}>사진을 등록해 주세요</span>
              )}
            </div>
          </label>

          <div className="input-container" style={{marginTop:"20px", marginBottom:"20px"}}>
              <span className="modal-text-style" style={{display:"inline-block", marginBottom:"10px"}}>닉네임</span><br/>
              <input type="text" className="U-age" name="nickname" value={formData.nickname} onChange={handleChange} style={{ width: 'auto', minWidth: '150px' }}/>
          </div>

          <button type="submit" className='G-button' style={{marginBottom:"20px"}}>저장</button>
        </form>
      </div>
    </div>
  );
}

export default Modal;
