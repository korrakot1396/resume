import React, { useEffect, useState } from "react";
import "./LoaderLogo.css";
import GifLoader from 'react-gif-loader';

const LogoLoader = () => {
  const [isGifLoaded, setIsGifLoaded] = useState(false);

  useEffect(() => {
    const gif = new Image();
    gif.onload = () => {
      setIsGifLoaded(true);
    };
    gif.src = "https://drive.google.com/uc?id=1GXXFtHJMXRLXlmFV0nyYY51Jvpyxo7ls";
  }, []);

  return (
    <div>
      {isGifLoaded ? (
        <GifLoader
          loading={true}
          imageSrc="https://drive.google.com/uc?id=1GXXFtHJMXRLXlmFV0nyYY51Jvpyxo7ls"
          imageStyle={{ width: "100%", height: "100%" }}
          overlayBackground="rgba(0,0,0,0.5)"
        />
      ) : (
        <p>Loading GIF...</p>
      )}
    </div>
  );
};

export default LogoLoader;
