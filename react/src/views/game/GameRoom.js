import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';

import styled from "styled-components";
import './GameRoom.css';

const StyledHeader = styled.div`
  background: black;
`;

function GameRoom() {
    const [localStream, setLocalStream] = useState(null);
    const [selectedCamera, setSelectedCamera] = useState('');
    const [cameras, setCameras] = useState([]);
    const myVideoRef = useRef();
    const [remoteStreams, setRemoteStreams] = useState({});
    const [muted, setMuted] = useState(false);
    const [cameraOff, setCameraOff] = useState(false);
    const stompClientRef = useRef(null);
    const peerConnectionsRef = useRef({});
    const myKey = useRef(Math.random().toString(36).substring(2, 15));
    const location = useLocation();
    const { roomNo, ...otherData } = location.state;

    // const accountSid = "AC19ef3c185bfec69e1f1849f33c2233f9";
    // const authToken = "11a0f881796d2810a08fc55664d21ea1";
    // const client = require('twilio')(accountSid, authToken);

    // client.tokens.create().then(token => console.log(token.username));
    
    const getCameras = async () => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            setCameras(videoDevices);
            if(videoDevices.length > 0 && !selectedCamera) {
                setSelectedCamera(videoDevices[0].deviceId);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleCameraChange = async (event) => {
        setSelectedCamera(event.target.value);
        await getMedia(event.target.value);
    };

    const getMedia = async (deviceId) => {
        const constraints = {
            audio: true,
            video: deviceId ? { deviceId: { exact: deviceId } } : true,
        };
        try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            if(myVideoRef.current) {
                myVideoRef.current.srcObject = stream;
            }
            setLocalStream(stream);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        getCameras();
    }, []);

    useEffect(() => {
        if(selectedCamera) {
            getMedia(selectedCamera);
        }
    }, [selectedCamera]);

    useEffect(() => {
        if (localStream) {
            const socket = new SockJS('http://localhost:3000/rtc'); // 실제 서버 URL로 변경
            const stompClient = Stomp.over(socket);
            
            stompClient.connect({}, frame => {
                
                stompClient.subscribe(`/sub/room/${roomNo}/offer`, message => {
                    const { type, from, sdp } = JSON.parse(message.body);
                    console.log('1번 /sub/room/${roomNo}/offer');
                    console.log('type:%s, from:%s, data:%s', type, from, sdp);
                    if (from === myKey.current) return; // 자신이 보낸 메시지는 무시
                    switch (type) {
                        case 'offer':
                            console.log('offer 보낸다');
                            handleOffer(from, sdp);
                            break;
                        case 'answer':
                            console.log('answer 보낸다');
                            peerConnectionsRef.current[from]?.setRemoteDescription(new RTCSessionDescription(sdp));
                            break;
                        case 'candidate':
                            console.log('candidate 보낸다');
                            peerConnectionsRef.current[from]?.addIceCandidate(new RTCIceCandidate(sdp));
                            break;
                        default:
                            console.log("Unknown message type:", type);
                            break;
                    }
                });

                createPeerConnection();
                
            }, error => {
                console.error("WebSocket connection error: ", error);
            });

            stompClientRef.current = stompClient;

            return () => {
                if (stompClientRef.current) {
                    stompClientRef.current.disconnect();
                }
            };
        }
    }, [localStream, roomNo]);

    // let sendOffer = (pc) => {
    //         pc.createOffer().then(offer =>{
    //             setLocalAndSendMessage(pc, offer);
    //             stompClientRef.current.send(`/pub/room/${roomNo}/offer`, {}, JSON.stringify({
    //                 type: 'candidate',
    //                 key : myKey.current,
    //                 body : offer
    //             }));
    //             console.log('Send offer');
    //         });
    //     };

    const createPeerConnection = (from) => {
        if (!peerConnectionsRef.current[from]) {
            const pc = new RTCPeerConnection({
                iceServers: [
                    { urls: "stun:global.stun.twilio.com:3478" },
                    { 
                        urls: "turn:global.turn.twilio.com:3478?transport=udp",
                        username: "3b1ed88a2d0364e2837df74d77c0e5f27ee2ec966e5b80d4d4990074dcc0f6dd",
                        credential: "9vt62ndq2857/weEoRo/JKm/PjlGnzDsgvHQa8dIg94="
                    },
                    {
                        urls: "turn:global.turn.twilio.com:3478?transport=tcp",
                        username: "3b1ed88a2d0364e2837df74d77c0e5f27ee2ec966e5b80d4d4990074dcc0f6dd",
                        credential: "9vt62ndq2857/weEoRo/JKm/PjlGnzDsgvHQa8dIg94="
                    },
                    {
                        urls: "turn:global.turn.twilio.com:443?transport=tcp",
                        username: "3b1ed88a2d0364e2837df74d77c0e5f27ee2ec966e5b80d4d4990074dcc0f6dd",
                        credential: "9vt62ndq2857/weEoRo/JKm/PjlGnzDsgvHQa8dIg94="
                    }
                ]
            });

            

            // localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

            pc.onicecandidate = event => {
                if (event.candidate) {
                    console.log('2번 pub/room/${roomNo}/ice-candidate');
                    console.log('ddd',event.candidate);
                    stompClientRef.current.send(`/pub/room/${roomNo}/ice-candidate`, {}, JSON.stringify({
                        type: 'candidate',
                        from: myKey.current,
                        candidate: event.candidate.candidate,
                    }));
                }
            };

            pc.ontrack = event => {
                console.log('event.streams[0]',event.streams)
                setRemoteStreams(prevStreams => ({
                    ...prevStreams,
                    [from]: event.streams[0]
                }));
            };
            
            console.log('pc 확인', pc);
            console.log('pc.ontrack 확인', pc.ontrack);

            // pc.createOffer().then(offer => {
            //     pc.setLocalDescription(offer);
            //     stompClientRef.current.send(`/pub/room/${roomNo}/offer`, {}, JSON.stringify({
            //         type: 'offer',
            //         from: myKey.current,
            //         sdp: offer.sdp,
            //     }));
            // }).catch(e => console.error(e));
            if (localStream) {
                localStream.getTracks().forEach(track => pc.addTrack(track, localStream));
            } else {
                console.error("localStream is null, cannot add tracks to PeerConnection");
                return;
            }
    

            peerConnectionsRef.current[from] = pc;
        }
        return peerConnectionsRef.current[from];
    };

    const handleOffer = async (from, sdp) => {
        if (!localStream) {
            console.error("Local stream is not ready.");
            return;
        }
        const pc = createPeerConnection(from);
        await pc.setRemoteDescription(new RTCSessionDescription({ type: 'offer', sdp }));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
    
        stompClientRef.current.send(`/pub/room/${roomNo}/answer`, {}, JSON.stringify({
            type: 'answer',
            from: myKey.current,
            to: from,
            sdp: answer.sdp,
        }));
    };

    const startConnection = async () => {
        const pc = createPeerConnection("local"); // "local"은 자신을 식별하는 임시 값입니다. 필요에 따라 적절하게 조정해야 합니다.
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
    
        stompClientRef.current.send(`/pub/room/${roomNo}/offer`, {}, JSON.stringify({
            type: 'offer',
            from: myKey.current,
            sdp: offer.sdp,
        }));
    };

    const toggleMute = () => {
        setMuted(!muted);
        if (localStream) {
            localStream.getAudioTracks()[0].enabled = !muted;
        }
    };

    const toggleCamera = () => {
        setCameraOff(!cameraOff);
        if (localStream) {
            localStream.getVideoTracks()[0].enabled = !cameraOff;
        }
    };

    return (
        <div style={{position:"absolute", width:"100%"}}>
        <button onClick={startConnection} disabled={!localStream}>연결 시작</button>
            <div style={{margin:"auto", marginTop:"20px", width:"1500px"}}>
                <div className='col-lg-12 col-md-12 game-match-container'>
                    <div className='webRTC-layout'>
                        <div className='webRTC-button-container'>
                            <div className="webRTC-button" onClick={toggleMute}>
                                <img src={require("./images/gamematch_mic.png")} alt="음소거 버튼"/>
                            </div>
                            <div className="webRTC-button" onClick={toggleCamera}>
                                <img src={require("./images/gamematch_video.png")} alt="카메라 온/오프 버튼"/>
                            </div>
                        </div>
                        <select className="camera-select" onChange={handleCameraChange} value={selectedCamera}>
                            {cameras.map((camera) => (
                                <option key={camera.deviceId} value={camera.deviceId}>
                                    {camera.label || `카메라 ${camera.deviceId}`}
                                </option>
                            ))}
                        </select>
                        <div className='webRTC-container'>
                            <div className='webRTC-item wi1'>
                                <video ref={myVideoRef} autoPlay playsInline muted={muted} />
                            </div>
                            {/* {Object.entries(remoteStreams).map(([key, stream]) => (
                                <div key={key} className='webRTC-item wi2'>
                                    <video autoPlay playsInline ref={ref => ref && (ref.srcObject = stream)} />
                                </div>
                            ))} */}
                            {Object.entries(remoteStreams).map(([key, stream]) => (
                                <div key={key} className='webRTC-item'>
                                    <video autoPlay playsInline ref={ref => {
                                        if (ref) ref.srcObject = stream;
                                    }} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GameRoom;