import React from "react";
import ReactDOM from "react-dom/client";
import App from "./frontend/popup/App";
import { simpleTrustScore } from "./scripts/simpleTrustAlg";
import "./frontend/popup/globals.css";

// this class will call all the layer components in order

// parse page
// Request data from scanner.js listener
async function getProductData() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        return new Promise((resolve, reject) => {
        if (!tab.id) {
            reject(new Error("No active tab found"));
            return;
        }
        chrome.tabs.sendMessage(tab.id, { action: "getData" }, (response: any) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(response);
            }
        });
    });
}

// Store the response in a variable
let productData: any = null;

getProductData()
  .then((data) => {
    productData = data;
    console.log("Product data retrieved:", productData);
    renderApp();
  })
  .catch((error) => {
    console.error("Failed to get product data:", error);
    renderApp();
  });

function renderApp() {
    if(productData != null){
        const evaluation = simpleTrustScore(productData.rating,
          productData.numSold,
          productData.numSold,
          productData.reviews.length,
          0
        );
        // display frontend
        const root = document.getElementById('root');
        if (root != null){
            ReactDOM.createRoot(root).render(
              <App trustData={evaluation}/>
            )
        }
    } else {
        const root = document.getElementById('root');
        if (root != null){
            ReactDOM.createRoot(root).render(
              <p>Parsing failed</p>
            )
        }
    }
}
