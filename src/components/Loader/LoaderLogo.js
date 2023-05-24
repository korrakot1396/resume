import React from "react";
import "./LoaderLogo.css";
import GifLoader from 'react-gif-loader';

const LogoLoader = () => {
  return (
    <GifLoader
      loading={true}
      imageSrc="https://drive.google.com/uc?id=1GXXFtHJMXRLXlmFV0nyYY51Jvpyxo7ls"
      imageStyle={{ width: "100%", height: "140%" }}
      overlayBackground="rgba(0,0,0,0.5)"
    />
  );
};

export default LogoLoader;
