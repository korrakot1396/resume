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
                <link rel="canonical" href="https://logobly.com/wp-content/uploads/001-rocket-1.png" />
            </Helmet>
      <Main />
    </div>
  );
}

export default App;
