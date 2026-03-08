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

    // ----------------------------
    // injectBadgeOnListing tests
    // ----------------------------

    test('does nothing if card is null', () => {
        expect(() => injectBadgeOnListing(null)).not.toThrow();
        expect(document.querySelector('.safecart-badge')).toBeNull();
    });

    test('injects badge with correct class and styles', () => {
        const card = document.createElement('div');
        document.body.appendChild(card);

        injectBadgeOnListing(card, 'https://example.com');

        const badge = card.querySelector('.safecart-badge');

        expect(badge).not.toBeNull();
        expect(badge.style.backgroundColor).toBe('rgb(37, 99, 235)');
        expect(badge.style.borderRadius).toBe('50%');
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

    test('clicking badge opens popup with link content', () => {
        const card = document.createElement('div');
        document.body.appendChild(card);

        injectBadgeOnListing(card, 'https://product.com');

        const badge = card.querySelector('.safecart-badge');
        badge.click();

        const popup = document.body.querySelector('div[style*="position: fixed"]');
        expect(popup).not.toBeNull();
        expect(popup.innerHTML).toContain('https://product.com');
    });

    test('close button removes popup', () => {
        const card = document.createElement('div');
        document.body.appendChild(card);

        injectBadgeOnListing(card, 'https://product.com');

        const badge = card.querySelector('.safecart-badge');
        badge.click();

        const button = document.querySelector('button');
        button.click();

        const popup = document.body.querySelector('div[style*="position: fixed"]');
        expect(popup).toBeNull();
    });

    // ----------------------------
    // injectBadges traversal tests
    // ----------------------------

    test('injectBadges finds cards and injects badge', () => {

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

    test('MutationObserver injects badge on dynamically added content', () => {

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

        const badge = document.querySelector('.safecart-badge');
        expect(badge).not.toBeNull();
    });

});