import React from "react";
import ReactDOM from "react-dom/client";
import App from "./frontend/popup/App";
import { simpleTrustScore } from "./scripts/simpleTrustAlg";
import "./frontend/popup/globals.css";
import { trustScore } from "./scripts/trustScore";
import { ListingData } from "./scripts/TrustModel";

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

const goodListing: ListingData = {
    price_dist: 0.04,
    seller_age_years: 9.03,
    rating: 4.9,
    num_sold: 5000,
    num_rating: 722,
    num_images: 61,
};
trustScore(goodListing)
  .then((score) => {
    console.log("Trust score for good listing:", score);
  })
  .catch((error) => {
    console.error("Failed to get trustScore:", error);
  });

const badListing: ListingData = {
    price_dist: -0.75,
    seller_age_years: 1.257,
    rating: 1.6,
    num_sold: 27,
    num_rating: 7,
    num_images: 0
}
trustScore(badListing)
  .then((score) => {
    console.log("Trust score for bad listing:", score);
  })
  .catch((error) => {
    console.error("Failed to get trustScore:", error);
  });

const medListing: ListingData = {
    price_dist: -0.21,
    seller_age_years: 1.48,
    rating: 4.6,
    num_sold: 101,
    num_rating: 19,
    num_images: 4
}
trustScore(medListing)
  .then((score) => {
    console.log("Trust score for medium listing:", score);
  })
  .catch((error) => {
    console.error("Failed to get trustScore:", error);
  });

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
        const evaluation = simpleTrustScore(
            productData.productRating,
            productData.numSold,
            productData.ageYears,
            productData.numRating,
            productData.reviewImages
        );
        console.log("Evaluation result:", evaluation);
        // display frontend
        const root = document.getElementById('root');
        if (root != null){
            console.log("Rendering app");
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
