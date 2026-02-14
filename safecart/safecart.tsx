import React from "react";
import ReactDOM from "react-dom/client";
import App from "./frontend/popup/App";
import { simpleTrustScore } from "./scripts/simpleTrustAlg";
import "./frontend/popup/globals.css";

// this class will call all the layer components in order

// parse page


// evaluation
const evaluation = simpleTrustScore(0, 0, 0,  0, 0)

// display frontend
const root = document.getElementById('root');
if (root != null){
    ReactDOM.createRoot(root).render(
        <App trustData={evaluation}/>
    )
}
