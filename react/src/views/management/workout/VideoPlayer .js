import React, { useRef, useState, useEffect } from 'react';
import * as tmPose from '@teachablemachine/pose';
import './VideoPlayer.css';


//로고
const Logo = () => (
  <svg className="icon" x="0px" y="0px" viewBox="0 0 24 24">
    <path fill="transparent" d="M0,0h24v24H0V0z"/>
    <path fill="#000" d="M20.5,5.2l-1.4-1.7C18.9,3.2,18.5,3,18,3H6C5.5,3,5.1,3.2,4.8,3.5L3.5,5.2C3.2,5.6,3,6,3,6.5V19  c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V6.5C21,6,20.8,5.6,20.5,5.2z M12,17.5L6.5,12H10v-2h4v2h3.5L12,17.5z M5.1,5l0.8-1h12l0.9,1  H5.1z"/>
  </svg>
);

// useInterval 훅 정의
function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const VideoPlayer = () => {
  const [videoSrc, setVideoSrc] = useState(null);
  const [model, setModel] = useState(null);
  
  let [pause, setPause] = useState(false);
  
  let [count, setCount] = useState(0);
  let [stand, setStand] = useState(1);

  //카메라 상태
  const [cameraName,setCameraName] = useState('VIDEO');

  const dropRef = useRef(null);
  const videoRef = useRef(null);

  let check = 0;

  useEffect(() => {
    const loadModel = async () => {
      // Teachable Machine Pose 모델 로드
      const modelURL = './my_model/model.json';
      const metadataURL = './my_model/metadata.json';
      const loadedModel = await tmPose.load(modelURL, metadataURL);
      setModel(loadedModel);
    };
    getCameras();
    loadModel();
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }

  const handleFile = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setVideoSrc(reader.result);
    };
    reader.readAsDataURL(file);
  }

  const handleDragOver = (e) => {
    e.preventDefault();
  }

  const getPredictionAccuracy = async () => {
    try {
      let canvas;
      if (cameraName != 'VIDEO') {
        const videoElement = myVideoRef.current; // Use the live video feed
        if (!videoElement) return;
        canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      } else {
        const videoElement = videoRef.current;
        if (!videoElement) return;
        canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      }
      // Estimate pose on the canvas
      const { pose, posenetOutput } = await model.estimatePose(canvas);
      // Predict based on the pose estimation
      const prediction = await model.predict(posenetOutput);
  
      let accuracy = prediction[1].probability.toFixed(2);
      if (!pause && accuracy > 0.8 && stand == 0) {
        check++;
        if (check >= 1) {
          setCount(count => count + 1);
          setStand(stand => stand + 1);
          check = 0;
        }
      } else if (stand != 0 && accuracy < 0.3) {
        setStand(0);
      }
    } catch (error) {
      console.error('Error getting prediction accuracy:', error);
    }
  };
  

  useInterval(() => {
    getPredictionAccuracy();
  }, 200);

  const handlePlaying = () => {
    setPause(false);
    pause = false;
  };

  const handlePause = () => {
    setPause(true);
    pause = true;
  };

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener('playing', handlePlaying);
      videoElement.addEventListener('pause', handlePause);

      return () => {
        videoElement.removeEventListener('playing', handlePlaying);
        videoElement.removeEventListener('pause', handlePause);
      };
    }
  }, [videoRef]);

  const handleInputChange = (e) => {
		const { name, value } = e.target;
    console.log(name,':',value);
    setCameraName(item=> item = value);
    setCount(0);
    handleCameraChange(e);
		// console.log(formData);
	};

  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState('');
  const [localStream, setLocalStream] = useState(null);
  const myVideoRef = useRef();
  const [muted, setMuted] = useState(false);
  //카메라 종류 체크
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

  return (
    <>
      <div>
        <select className="CATEGORY" onChange={handleInputChange}>
          <option value='VIDEO'>VIDEO</option>
          {cameras.map((camera) => (
            <option key={camera.deviceId} value={camera.deviceId}>
              {camera.label || `카메라 ${camera.deviceId}`}
            </option>
          ))}
        </select>
        </div>

      <div className="video-counter-container">
        <div className="video-container" ref={dropRef} style={{ width: '100%',height: '445px', textAlign: 'center',border: '1px dashed #ccc' }} onDrop={handleDrop} onDragOver={handleDragOver}>
          {cameraName === 'VIDEO' ?
            <>
              {videoSrc ? (
                <video ref={videoRef} controls style={{ width: '100%', height: '100%'}}>
                  <source src={videoSrc} type="video/mp4" />
                  비디오 태그를 지원하지 않는 브라우저입니다.
                </video>
              ) : (
                  <>
                    <p>비디오 파일을 여기로 드래그 앤 드롭하세요.</p>
                    <Logo />
                  </>
                )}
            </>
            :
            <>
              <div >
                <video style={{ width: '100%', height: '50%', textAlign: 'center' }} ref={myVideoRef} autoPlay playsInline muted={muted} />
              </div>
            </>
          }
        </div>

        <div className="counter-container">
          <h4 className="title-counter" id='pose-counts'>카운트</h4>
          <span className="number-counter">{count}</span>
        </div>

      </div>
      </>
    )};

export default VideoPlayer;