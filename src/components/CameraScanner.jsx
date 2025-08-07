import React, { useRef, useState } from 'react';

const CameraScanner = ({ onImageCaptured }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
    setIsStreaming(true);
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const imageData = canvas.toDataURL('image/png');
    onImageCaptured(imageData);
  };

  return (
    <div>
      {!isStreaming && <button onClick={startCamera}>Start kamera</button>}
      <video ref={videoRef} autoPlay playsInline style={{ width: '100%', maxWidth: 400 }} />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {isStreaming && <button onClick={captureImage}>Ta bilde</button>}
    </div>
  );
};

export default CameraScanner;