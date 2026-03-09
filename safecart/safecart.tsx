import React from "react";
import ReactDOM from "react-dom/client";
import App from "./frontend/popup/App";
import { simpleTrustScore } from "./scripts/simpleTrustAlg";
import { trustScore } from "./scripts/trustAlg";
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

async function getMarketPrice(doc: Document) {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return new Promise((resolve, reject) => {
        if (!tab.id) {
            reject(new Error("No active tab found"));
            return;
        }
        chrome.tabs.sendMessage(tab.id, { action: "getDataFromSearch", html: doc }, (response: any) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(response);
            }
        });
    });
}

async function getSearchUrl() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return new Promise((resolve, reject) => {
        if (!tab.id) {
            reject(new Error("No active tab found"));
            return;
        }
        chrome.tabs.sendMessage(tab.id, { action: "getURLToScapeForListing" }, (response: any) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(response);
            }
        });
    });
}

async function fetchFullHTML(url: string) : Promise<string> {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(
            {action: "fetchFullHTML", url: url },
            (response) => {
                if (response?.success) {
                    resolve(response.html);
                } else {
                    reject(response?.error);
                }
            }
        );
    });
}

// Store the response in a variable
let productData: any = null;
let searchUrl: any = null;
let searchDoc: any = null;
let marketPrice: any = null;



getProductData()
    .then((data) => {
        productData = data;
        console.log("Product data retrieved:", productData);
    })
    .catch((error) => {
        console.error("Failed to get product data:", error);
        renderApp();
    });

getSearchUrl()
    .then((data: any) => {
        searchUrl = data.URLToScape;
        console.log("Search url retrieved:", searchUrl);

        // Now perform the scraping
        return fetchFullHTML(searchUrl);
    })
    .then((html) => {
        const parser = new DOMParser();
        searchDoc = parser.parseFromString(html, "text/html");
        console.log("Search Doc retrieved:", searchDoc);

        // Now get market price
        return getMarketPrice(searchDoc);
    })
    .then((data) => {
        marketPrice = data;
        console.log("Market price retrieved:", marketPrice);
        renderApp();
    })
    .catch((error) => {
        console.error("Failed to get search url or scrape:", error);
        renderApp();
    });

// displays the popup from the extension
function renderApp() {
    if(productData != null){
        const evaluation = trustScore(
            productData.listingPrice,
            marketPrice.averagePrice,
            productData.productRating,
            productData.numSold,
            productData.ageYears,
            productData.numRating,
            productData.reviewImages
        );
        // const evaluation = simpleTrustScore(
        //     productData.productRating,
        //     productData.numSold,
        //     productData.ageYears,
        //     productData.numRating,
        //     productData.reviewImages
        // );
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
              <p>Parsing failed. Please click into a product listing on Aliexpress</p>
            )
        }
    }
}
