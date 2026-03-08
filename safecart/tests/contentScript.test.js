/**
 * @jest-environment jsdom
 */

window.__SAFE_CART_TEST__ = true;

const {
    injectBadgeOnListing,
    injectBadges
} = require('../frontend/content/contentScript');

describe('SafeCart Content Script', () => {

    beforeEach(() => {
        document.body.innerHTML = '';
        jest.restoreAllMocks();
    });

    // ================================
    // injectBadgeOnListing tests
    // ================================

    test('does nothing if card is null', () => {
        expect(() => injectBadgeOnListing(null)).not.toThrow();
        expect(document.querySelector('.safecart-badge')).toBeNull();
    });

    test('injects badge with correct styles and content', () => {
        const card = document.createElement('div');
        document.body.appendChild(card);

        injectBadgeOnListing(card, 'https://example.com');

        const badge = card.querySelector('.safecart-badge');

        expect(badge).not.toBeNull();
        expect(badge.style.borderRadius).toBe('50%');
        expect(badge.style.position).toBe('relative');
        expect(badge.style.pointerEvents).toBe('auto');
        expect(card.style.position).toBe('relative');
        expect(badge.innerHTML).toContain('S');
    });

    test('does not inject duplicate badge', () => {
        const card = document.createElement('div');
        document.body.appendChild(card);

        injectBadgeOnListing(card, 'link1');
        injectBadgeOnListing(card, 'link2');

        const badges = card.querySelectorAll('.safecart-badge');
        expect(badges.length).toBe(1);
    });

    test('clicking badge opens popup and close button removes it', () => {
        const card = document.createElement('div');
        document.body.appendChild(card);

        injectBadgeOnListing(card, 'https://product.com');

        const badge = card.querySelector('.safecart-badge');
        badge.click();

        const popup = document.querySelector('div[style*="position: fixed"]');
        expect(popup).not.toBeNull();
        expect(popup.innerHTML).toContain('https://product.com');

        const button = popup.querySelector('button');
        button.click();

        expect(document.querySelector('div[style*="position: fixed"]')).toBeNull();
    });

    // ================================
    // injectBadges initial traversal
    // ================================

    test('injectBadges finds existing cards and injects badge', () => {
        document.body.innerHTML = `
            <a href="https://example.com/product">
                <div>
                    <div>
                        <div>
                            <div class="np_nq"></div>
                        </div>
                    </div>
                </div>
            </a>
        `;

        injectBadges();

        const badge = document.querySelector('.safecart-badge');
        expect(badge).not.toBeNull();
    });

    // ================================
    // MutationObserver tests
    // ================================

    test('MutationObserver injects badge for dynamically added elements', async () => {
        injectBadges();

        const wrapper = document.createElement('div');
        wrapper.innerHTML = `
            <a href="https://dynamic.com/product">
                <div>
                    <div>
                        <div>
                            <div class="np_nq"></div>
                        </div>
                    </div>
                </div>
            </a>
        `;

        document.body.appendChild(wrapper);

        // allow MutationObserver to run
        await new Promise(resolve => setTimeout(resolve, 0));

        const badge = document.querySelector('.safecart-badge');
        expect(badge).not.toBeNull();

        // click dynamic badge to cover that branch too
        badge.click();
        const popup = document.querySelector('div[style*="position: fixed"]');
        expect(popup).not.toBeNull();
    });

    test('MutationObserver ignores non-element nodes', async () => {
        injectBadges();

        const textNode = document.createTextNode("hello");
        document.body.appendChild(textNode);

        await new Promise(resolve => setTimeout(resolve, 0));

        const badges = document.querySelectorAll('.safecart-badge');
        expect(badges.length).toBe(0);
    });

});