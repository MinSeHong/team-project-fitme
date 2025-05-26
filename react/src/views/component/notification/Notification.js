import React, {useState, useEffect} from "react";
import { Stomp } from "@stomp/stompjs";

const Notification = () => {

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
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080/ws');
        const stompClient = Stomp.over(socket);
        
        stompClient.connect({}, () => {
        stompClient.subscribe('/sub/topic/notification', (response) => {
            console.log('Received message:', JSON.parse(response.body).message);
            try {
                const receivedNotification = JSON.parse(response.body);
                setNotifications(prevNotifications => [...prevNotifications, receivedNotification]);
            } catch (error) {
                console.error('Error parsing message:', error);
            }
        });
        });

        return () => {
        stompClient.disconnect();
        };
    }, []);

    const handleClick = () => {
        const socket = new WebSocket('ws://localhost:8080/ws');
        const stompClient = Stomp.over(socket);

        stompClient.connect({}, () => {
            stompClient.send('/pub/sendNotification', {
                headers: {
                    'Authorization' : `${myCookieValue}`
                }
            }, JSON.stringify({ message: 'New request!' }));
        });
    };

    return (
        <div>
        <h1 onClick={handleClick}>Notifications</h1>
        <ul>
            {notifications.map((notification, index) => (
                <li key={index}>{notification.message}</li>
            ))}
        </ul>
        </div>
    );
};
  
export default Notification;