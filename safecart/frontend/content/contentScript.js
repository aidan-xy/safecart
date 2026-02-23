// SafeCart Content Script
// -------------------------------
// This script injects small SafeCart badges onto product listings
// across AliExpress pages. It handles multiple layout variations
// and dynamically loads badges as new items are added to the page.

// Simple helper function: inject a badge into a single "card"
function injectBadgeOnListing(card) {
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
    badge.style.backgroundColor = '#ffffff';
    badge.style.pointerEvents = 'auto';    // ensure clicks reach the badge, not elements behind it

    // --- Placeholder content for now ---
    // TODO: replace the "S" with SafeCart logo when ready
    badge.innerHTML = `<span style="font-size:14px;font-weight:bold;color:#2563eb;">S</span>`;

    // Make sure the card itself is positioned so the badge is placed correctly
    card.style.position = 'relative';

    // Append the badge to the card
    card.appendChild(badge);

    // Make the badge clickable
    badge.addEventListener('click', (event) => {
        event.preventDefault();     // prevent default link behavior
        event.stopPropagation();    // prevent event from bubbling up
        console.log("SafeCart badge clicked!");
        // TODO: Add your script/function call here
        // Example: runTrustCheck(card);
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
        injectBadgeOnListing(card);
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
                        const card = el.closest('div');
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
console.log("SAFE CART IS RUNNING");
injectBadges();