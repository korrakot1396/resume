import React from "react";
import "./App.css";
import Main from "./containers/Main";
import {Helmet} from "react-helmet";

function App() {
  return (
    <div>
       <Helmet>
                <meta charSet="utf-8" />
                <title>Korrakot Resume</title>
                <link rel="canonical" href="https://raw.githubusercontent.com/korrakot1396/resume/master/public/favicon.png" />
            </Helmet>
      <Main />
    </div>
  );
}

export default App;
