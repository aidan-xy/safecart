// SafeCart Content Script
// -------------------------------
// This script injects small SafeCart badges onto product listings
// across AliExpress pages. It handles multiple layout variations
// and dynamically loads badges as new items are added to the page.

import ReactDOM from "react-dom/client";
import App from "../popup/App";
import { trustScore } from "../../scripts/trustAlg";
import { getAllInformationForAlg, createURLForSearchPage, computeMedianPrice } from "../../scripts/scanner"

// Simple helper function: inject a badge into a single "card"
export function injectBadgeOnListing(card, link) {
    // Exit early if card is invalid or already has a badge
    if (!card || card.querySelector('.safecart-badge')) return;

    // Create badge element
    const badge = document.createElement('div');
    badge.className = 'safecart-badge';

    // --- Style the badge ---
    badge.style.position = 'relative';
    badge.style.bottom = '-10px';           // distance from bottom of card
    badge.style.left = '80px';             // distance from left of card
    badge.style.width = '40px';
    badge.style.height = '40px';
    badge.style.borderRadius = '50%';     // circular
    badge.style.display = 'flex';
    badge.style.alignItems = 'center';
    badge.style.justifyContent = 'center';
    badge.style.cursor = 'pointer';
    badge.style.zIndex = '9999';          // above other elements
    badge.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
    badge.style.backgroundColor = '#2563eb';
    badge.style.pointerEvents = 'auto';    // ensure clicks reach the badge, not elements behind it

    // --- Placeholder content for now ---
    // TODO: replace the "S" with SafeCart logo when ready
    badge.innerHTML = `<span style="font-size:14px;font-weight:bold;color:#ffffff;">S</span>`;

    // Make sure the card itself is positioned so the badge is placed correctly
    card.style.position = 'relative';

    // Append the badge to the card
    card.appendChild(badge);

    // Make the badge clickable
    badge.addEventListener('click', async (event) => {
        event.preventDefault();
        event.stopPropagation();

        // Create host
        if (document.getElementById("safecart-overlay")) return;
        const host = document.createElement("div");
        host.style.position = "fixed";
        host.style.top = "0";
        host.style.left = "0";
        host.style.zIndex = "2147483647";
        host.id = "safecart-overlay";
        document.body.appendChild(host);

        // Attach shadow root
        const shadowRoot = host.attachShadow({ mode: "open" });

        // Inject CSS inside shadow root
        const styleLink = document.createElement("link");
        styleLink.rel = "stylesheet";
        styleLink.href = chrome.runtime.getURL("dist/assets/popup.css");
        shadowRoot.appendChild(styleLink);

        // Overlay container
        const overlay = document.createElement("div");
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100vw";
        overlay.style.height = "100vh";
        overlay.style.display = "flex";
        overlay.style.alignItems = "center";
        overlay.style.justifyContent = "center";
        overlay.style.background = "rgba(0,0,0,0.4)";
        overlay.style.zIndex = "2147483647";
        shadowRoot.appendChild(overlay);

        // Modal container
        const modal = document.createElement("div");
        modal.style.position = "relative";
        modal.style.background = "white";
        modal.style.padding = "20px";
        modal.style.borderRadius = "12px";
        modal.style.minWidth = "300px";
        overlay.appendChild(modal);

        // Close button inside modal
        const closeBtn = document.createElement("button");
        closeBtn.textContent = "×";
        closeBtn.style.position = "absolute";
        closeBtn.style.top = "-5px";
        closeBtn.style.right = "5px";
        closeBtn.style.cursor = "pointer";
        closeBtn.style.fontSize = "18px";
        closeBtn.style.background = "transparent";
        closeBtn.style.border = "none";
        closeBtn.addEventListener("click", () => host.remove());
        modal.appendChild(closeBtn);

        // React root inside modal
        const reactRoot = document.createElement("div");
        modal.appendChild(reactRoot);

        ReactDOM.createRoot(reactRoot).render(
            "Please Wait..."
        );

        // Run trust evaluation

        let productData = null;
        let searchUrl = null;
        let searchDoc = null;
        let listingDoc = null;
        let marketPrice = null;
        const parser = new DOMParser();

        const listingHTML = await fetchFullHTML(link);
        listingDoc = parser.parseFromString(listingHTML, 'text/html');
        console.log("Listing HTML retrieved:", listingDoc);

        productData = getAllInformationForAlg(listingDoc);
        console.log("Product Data:", productData);

        searchUrl = createURLForSearchPage(listingDoc, link);
        console.log("Search URL:", searchUrl);

        const searchHTML = await fetchFullHTML(searchUrl);
        searchDoc = parser.parseFromString(searchHTML, 'text/html')
        console.log("Search HTML retrieved:", searchDoc);

        marketPrice = computeMedianPrice(searchDoc);
        console.log("Market Price:", marketPrice);

        const evaluation = trustScore(
            productData.listingPrice,
            marketPrice,
            productData.productRating,
            productData.numSold,
            productData.numRating,
            productData.reviewImages
        );

        ReactDOM.createRoot(reactRoot).render(
            <App trustData={evaluation} />
        );
    });
}

// Main function: find all cards and inject badges
export function injectBadges() {
    const query = 'div.nc_ne ';

    // AliExpress uses multiple layouts. We search for product links or common containers
    const possibleCards = document.querySelectorAll(
        query
    );

    // Inject badge for each card found
    possibleCards.forEach((el) => {
        const card = el.closest('div').parentElement.closest('div').parentElement.closest('div'); // finds the correct container
        const link = card.parentElement.closest('a').href;
        injectBadgeOnListing(card, link);
    });

    // -------------------------------
    // Dynamic updates: handle new cards loaded later (infinite scroll, carousels)
    // -------------------------------
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) { // only elements
                    const newCards = node.querySelectorAll(
                        query
                    );
                    newCards.forEach((el) => {
                        const card = el.closest('div').parentElement.closest('div').parentElement.closest('div'); // finds the correct container
                        const link = card.parentElement.closest('a').href;
                        injectBadgeOnListing(card, link);
                    });
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

async function fetchFullHTML(url) {
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

// -------------------------------
// Script starts here
// -------------------------------

console.log("SAFE CART IS RUNNING");
injectBadges();