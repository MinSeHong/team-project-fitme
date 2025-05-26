import React from 'react';
import '../../adminstyle/RpostModal.css'

function RpostModal({ member, closeModal }) {
  return (
    <div className="RM">
      <div className="RMC">
        <span className="close" onClick={closeModal}>&times;</span>
        <h2>{member.title}</h2>
        <p>{member.content}</p>
      </div>
    </div>
  );
}

export default RpostModal;
