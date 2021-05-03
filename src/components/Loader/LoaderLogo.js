import React from "react";
import "./LoaderLogo.css";

class LogoLoader extends React.Component {
  render() {
    return (
   
  <div class="center">
  <div class="fakeMenu">
  <div class="fakeButtons fakeClose"></div>
  <div class="fakeButtons fakeMinimize"></div>
  <div class="fakeButtons fakeZoom"></div>
  </div>
 

<div class="fakeScreen">
  <p class="line1">&#91;&nbsp;&ldquo;I am Korrakot Triwichian.&rdquo;,<span class="cursor1">_</span></p>
  <p class="line2">&nbsp;&nbsp;&ldquo;I am Full-Stack Developer.&rdquo;,<span class="cursor2">_</span></p>
  <p class="line3">&nbsp;&nbsp;&ldquo;Welcome to My Website.&rdquo;&nbsp;&#93;<span class="cursor2">_</span></p>
  <p class="line4"><span class="cursor4">_</span></p>
</div>
</div>


  


    );
  }
}

export default LogoLoader;
