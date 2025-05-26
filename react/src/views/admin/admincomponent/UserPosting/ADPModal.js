import React from 'react';
import './ADPModal.css';

// ADPModal 컴포넌트
const ADPModal = ({ post, closeModal }) => {
  console.log(post); // post 데이터 확인
  // post가 존재하는지 확인하고 속성을 안전하게 읽음
  const title = post?.title || '제목 없음';
  const name = post?.name || '작성자 없음';
  const content = post?.content || '내용 없음';
  const image = post?.image || '이미지 없음';

  // 게시글 삭제 함수
  const deletePost = () => {
    alert(`${title} 게시글이 삭제되었습니다.`);
    closeModal(); // 모달 닫기
  };

  return (
    <div className="ADPModal">
      <div className="ADPModal-content">
        <span className="ADPclose" onClick={closeModal}>&times;</span>
        <h2>{title}</h2>
        <p>이미지: {image}</p>
        <p>작성자: {name}</p>
        <p>내용: {content}</p>
        {/* 추가 정보 표시 */}
        {/* 삭제 버튼 */}
        <button className="deleteButton" onClick={deletePost}>게시글 삭제</button>
      </div>
    </div>
  );
};

export default ADPModal;
