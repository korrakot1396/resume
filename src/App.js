import React from "react";
import "./App.css";
import Main from "./containers/Main";
import {Helmet} from "react-helmet";

function App() {
  return (
    <div>
       <Helmet>
                <meta charSet="utf-8" />
                <title>Korrakot's Portfolio</title>
    
        <meta property="og:type" content="website"/>
        <meta property="og:url" content="https://korrakot1396.github.io/resume/"/>
        <meta property="og:title" content="Korrakot's Portfolio"/>
        <meta property="og:description" content=""/>
        <meta
            property="og:image"
            content="https://drive.google.com/drive/folders/1XdRaASDjwqxYza3Uz63YsmgIDEYsaZzO?usp=sharing"/>

     
        <meta property="twitter:card" content="summary_large_image"/>
        <meta property="twitter:url" content="https://korrakot1396.github.io/resume/"/>
        <meta property="twitter:title" content="Korrakot's Portfolio"/>
        <meta property="twitter:description" content=""/>
        <meta
            property="twitter:image"
            content="https://drive.google.com/drive/folders/1XdRaASDjwqxYza3Uz63YsmgIDEYsaZzO?usp=sharing"/>
            </Helmet>
      <Main />
    </div>
  );
}

export default App;
