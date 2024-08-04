// components/CameraComponent.js
import React, { useRef } from 'react';
import { Camera } from 'react-camera-pro';

const CameraComponent = ({ onCapture }) => {
  const cameraRef = useRef(null);

  const handleCapture = () => {
    const photo = cameraRef.current.takePhoto();
    onCapture(photo);
  };

  return (
    <div>
      <Camera ref={cameraRef} />
      <button onClick={handleCapture}>Capture Photo</button>
    </div>
  );
};

export default CameraComponent;
