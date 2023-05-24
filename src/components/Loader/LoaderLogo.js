import React from "react";
import "./LoaderLogo.css";
// import GifLoader from 'react-gif-loader';
import Lottie from 'react-lottie';
import animationData from './LoaderLogo.json';

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice"
  }
};

const LogoLoader = () => {
  return (
    // <GifLoader
    //   loading={true}
    //   imageSrc="https://drive.google.com/uc?id=1GXXFtHJMXRLXlmFV0nyYY51Jvpyxo7ls"
    //   imageStyle={{ width: "100%", height: "140%" }}
    //   overlayBackground="rgba(0,0,0,0.5)"
    // />
    <div className="lottie-container">
  <Lottie 
    options={defaultOptions}
    height="100%"
    width="100%"
  />
</div>
  );
};

export default LogoLoader;
