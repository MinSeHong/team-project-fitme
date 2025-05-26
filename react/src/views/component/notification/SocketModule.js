import { Stomp } from "@stomp/stompjs";

let stompClient = null;

export function connectSocket() {
  if (!stompClient) {
    stompClient = Stomp.over(new WebSocket('ws://localhost:8080/ws'));
  }
}

export function disconnectSocket() {
  if (stompClient) {
    stompClient.disconnect(() => {
      console.log('Disconnected');
      stompClient = null;
    });
  }
}

export function getSocket() {
  return stompClient;
}