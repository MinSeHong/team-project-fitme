import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './InbodyModal.css';

function InbodyModal({ isOpen, onClose, onSubmit, ocrData }) {
    const [weight, setWeight] = useState(ocrData[0] || '');
    const [skeletal_muscle, setSkeletal_muscle] = useState(ocrData[1] || '');
    const [bodyFat_mass, setBodyFat_mass] = useState(ocrData[2] || '');
    const [BMI, setBMI] = useState(ocrData[3] || '');
    const [bodyFat_percent, setBodyFat_percent] = useState(ocrData[4] || '');

    const handleSave = () => {
        // 수정된 데이터를 axios를 사용하여 서버에 저장
        const modifiedData = {
            weight: weight,
            skeletal_muscle: skeletal_muscle,
            bodyFat_mass: bodyFat_mass,
            BMI: BMI,
            bodyFat_percent: bodyFat_percent
        };
        // axios.put('/api/inbody', modifiedData)
        //     .then(response => {
        //         // 성공적으로 처리한 경우
        //         onClose();
        //     })
        //     .catch(error => {
        //         // 오류 처리
        //         console.error('Inbody 데이터 업데이트 오류:', error);
        //     });
        // onSubmit을 호출하여 수정된 데이터를 상위 컴포넌트로 전달
        onSubmit(modifiedData);
        onClose();
    };

    const closeModal = () => {
        // 모달 닫기
        onClose();
    };

    return (
        <>
            {/* 배경 오버레이 */}
            <div className="overlay-background"></div>
            {/* 인바디 모달 */}
            <div className='inbody-modal'  style={{height:"610px"}}>
                <div className='modal-profile-edit-title' style={{textAlign:"center",marginTop:"10px"}}>인바디 데이터 수정</div>
                
                
                <div className='inbody-modal-div' style={{marginTop:"40px"}}>
                    <span className="inbody-modal-text-style">체중</span><br/>
                    <input type="text" value={weight} onChange={(e) => setWeight(e.target.value)} style={{marginTop:"10px", height:"40px", width:"200px"}} />
                </div>

                <div className='inbody-modal-div'>
                    <span className="inbody-modal-text-style">골격근량</span><br/>
                    <input type="text" value={skeletal_muscle} onChange={(e) => setSkeletal_muscle(e.target.value)} style={{marginTop:"10px", height:"40px", width:"200px"}}  />
                </div>

                <div className='inbody-modal-div'>

                    <span className="inbody-modal-text-style">체지방량</span><br/>
                    <input type="text" value={bodyFat_mass} onChange={(e) => setBodyFat_mass(e.target.value)} style={{marginTop:"10px", height:"40px", width:"200px"}}  />

                </div>


                <div className='inbody-modal-div'>
                    <span className="inbody-modal-text-style" style={{textAlign:"center"}}>BMI</span><br/>
                    <input type="text" value={BMI} onChange={(e) => setBMI(e.target.value)} style={{marginTop:"10px", height:"40px", width:"200px"}}  />
                </div>

                <div className='inbody-modal-div'>
                    <span className="inbody-modal-text-style">체지방률</span><br/>
                    <input type="text" value={bodyFat_percent} onChange={(e) => setBodyFat_percent(e.target.value)} style={{marginTop:"10px", height:"40px", width:"200px"}}  />
                </div>

                <div style={{display:"flex", justifyContent:"center", gap:"20px"}}>
                    {/* 저장 버튼 */}
                    <button onClick={handleSave} style={{width:"90px", height:"40px"}}>저장</button>
                    {/* 취소 버튼 */}
                    <button onClick={closeModal} style={{width:"90px", height:"40px"}}>취소</button>
                </div>
            </div>
        </>
    );
}

export default InbodyModal;
