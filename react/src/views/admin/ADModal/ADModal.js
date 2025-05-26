import './ADModal.css'

// 모달 컴포넌트
const ADModal = ({ member, closeModal }) => {
  // 회원 정지 함수
  const stopMember = () => {
      alert(`${member.name}님이 정지되었습니다.`);
      closeModal(); // 모달 닫기
  };

  // 회원 삭제 함수
  const deleteMember = () => {
      alert(`${member.name}님이 삭제되었습니다.`);
      closeModal(); // 모달 닫기
  };
    return (
      <div className="ADModal">
        <div className="ADModal-content">
          <span className="ADclose" onClick={closeModal}>&times;</span>
          <h2>{member.name}님의 상세 정보</h2>
          <p>사진: {member.image}</p>
          <p>나이: {member.age}</p>
          <p>취미: {member.hobby}</p>
          <p>아이디: {member.username}</p>
          <p>주소: {member.address}</p>
          <p>취미: {member.hobby}</p>
          <p>가입일: {member.enroll_date}</p>
          {/* 회원 정지 버튼 */}
          <button className="stopButton" onClick={stopMember}>회원 정지</button>
          {/* 회원 삭제 버튼 */}
          <button className="deleteButton" onClick={deleteMember}>회원 삭제</button>
        </div>
      </div>
    );
  };
export default ADModal;