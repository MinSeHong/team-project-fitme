import {Link} from 'react-router-dom';
import React from 'react';
import './ChatbotFloating.css';

function ChatbotFloating() {
    return (
        <>
        <div className="chatbot-floating">
            <img src={require("./images/chatbot.png")} style={{width:"100%", height:"100%"}}/>

        </div>
        </>

    );
  }
  
  export default ChatbotFloating;
  




