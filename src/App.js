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
                <link rel="canonical" href="https://drive.google.com/file/d/1Exso7XAlIcOIpJWvfLU8UaCbbB6rwqla/view?usp=sharing" />
            </Helmet>
      <Main />
    </div>
  );
}

export default App;
