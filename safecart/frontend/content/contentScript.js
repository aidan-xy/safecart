// SafeCart Content Script
// -------------------------------
// This script injects small SafeCart badges onto product listings
// across AliExpress pages. It handles multiple layout variations
// and dynamically loads badges as new items are added to the page.

// Simple helper function: inject a badge into a single "card"
function injectBadgeOnListing(card, link) {
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
    badge.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();

        // Create popup container
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = '#ffffff';
        popup.style.padding = '20px';
        popup.style.borderRadius = '8px';
        popup.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
        popup.style.zIndex = '10000';



        popup.innerHTML = `
            <p style="margin:0 0 15px 0;">` + link + 
            `<button style="padding:5px 15px; background:#2563eb; color:white; border:none; borderRadius:4px; cursor:pointer;">Close</button>
        `;

        document.body.appendChild(popup);
        popup.querySelector('button').addEventListener('click', () => popup.remove());
    });
}

// Main function: find all cards and inject badges
function injectBadges() {
    const query = 'div.np_nq';

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
                        injectBadgeOnListing(card);
                    });
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

// -------------------------------
// Script starts here
// -------------------------------
if (typeof window !== 'undefined' && !window.__SAFE_CART_TEST__) {
    console.log("SAFE CART IS RUNNING");
    injectBadges();
}

if (typeof module !== 'undefined') {
    module.exports = {
        injectBadgeOnListing,
        injectBadges
    };
}