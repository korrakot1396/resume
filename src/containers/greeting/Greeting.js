import React from "react";
import "./Greeting.css";
import SocialMedia from "../../components/socialMedia/SocialMedia";
import { greeting } from "../../portfolio";
import { Fade } from "react-reveal";

export default function Greeting() {
  return (
    <Fade bottom duration={1000} distance="40px">
      <div className="greet-main" id="greeting">
        <div className="greeting-main">
          <div className="greeting-text-div">
            <div>
              <h1 className="greeting-text">{greeting.title}</h1>
              <h2 className="greeting-nickname">( {greeting.nickname} )</h2>
              <p className="greeting-text-p subTitle">{greeting.subTitle}</p>
              <SocialMedia />
              {/* <div className="button-greeting-div">
              <Button text="Contact me" href="#contact" />
              <Button text="See my resume" newTab={true} href={greeting.resumeLink} />
            </div> */}
            </div>
          </div>
          <div className="greeting-image-div">
            <img
              alt="img-greeting"
              src={require("../../assests/images/korrakot.GIF")}
            ></img>
            
            
          </div>
        </div>
      </div>
    </Fade>
  );
}
