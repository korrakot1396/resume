import React, { useEffect, useState } from "react";
import "./Splash.css";
import { Redirect } from "react-router-dom";
import LoaderLogo from "../../components/Loader/LoaderLogo.js";

function AnimatedSplash() {
  return (
    <div className="logo_wrapper">
      <div className="screen">
        <LoaderLogo id="logo" />
      </div>
    </div>
  );
}

function Splash() {
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => setRedirect(true), 5500);
    return () => clearTimeout(timeoutId);
  }, []);

  const aniMatedSplash = <AnimatedSplash />;

  return redirect ? <Redirect to="/home" /> : aniMatedSplash;
}

export default Splash;
