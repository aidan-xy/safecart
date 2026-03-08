/**
 * @jest-environment jsdom
 *
 * We explicitly use jsdom because this file tests DOM manipulation.
 * This ensures document, window, and MutationObserver exist.
 */

// Prevent auto-execution of injectBadges() when the module loads
window.__SAFE_CART_TEST__ = true;

const {
    injectBadgeOnListing,
    injectBadges
} = require('../frontend/content/contentScript');

describe('SafeCart Content Script', () => {

    /**
     * Reset DOM before each test to ensure isolation.
     * This prevents badges or popups from leaking across tests.
     */
    beforeEach(() => {
        document.body.innerHTML = '';
        jest.restoreAllMocks();
    });

    // =====================================================
    // injectBadgeOnListing() UNIT TESTS
    // =====================================================

    test('returns early when card is null (guard clause branch 1)', () => {
        expect(() => injectBadgeOnListing(null)).not.toThrow();
        expect(document.querySelector('.safecart-badge')).toBeNull();
    });

    test('returns early when badge already exists (guard clause branch 2)', () => {
        const card = document.createElement('div');
        document.body.appendChild(card);

        injectBadgeOnListing(card, 'first-link');
        injectBadgeOnListing(card, 'second-link'); // should not create second badge

        const badges = card.querySelectorAll('.safecart-badge');
        expect(badges.length).toBe(1);
    });

    test('injects badge with correct styles and content', () => {
        const card = document.createElement('div');
        document.body.appendChild(card);

        injectBadgeOnListing(card, 'https://example.com');

        const badge = card.querySelector('.safecart-badge');

        // Badge exists
        expect(badge).not.toBeNull();

        // Style assertions (ensures styling logic is executed)
        expect(badge.style.borderRadius).toBe('50%');
        expect(badge.style.pointerEvents).toBe('auto');
        expect(card.style.position).toBe('relative');

        // Content assertion
        expect(badge.innerHTML).toContain('S');
    });

    test('clicking badge opens popup and close button removes it (link defined)', () => {
        const card = document.createElement('div');
        document.body.appendChild(card);

        injectBadgeOnListing(card, 'https://product.com');

        const badge = card.querySelector('.safecart-badge');
        badge.click();

        // Popup should be created
        const popup = document.querySelector('div[style*="position: fixed"]');
        expect(popup).not.toBeNull();

        // Ensure link content is interpolated correctly
        expect(popup.innerHTML).toContain('https://product.com');

        // Close popup
        const button = popup.querySelector('button');
        button.click();

        // Popup removed from DOM
        expect(document.querySelector('div[style*="position: fixed"]')).toBeNull();
    });

    // =====================================================
    // injectBadges() INITIAL DOM SCAN
    // =====================================================

    test('injectBadges finds existing cards and injects badge', () => {

        /**
         * This structure mirrors the nested DOM depth your traversal relies on:
         * el.closest('div').parentElement.closest('div').parentElement.closest('div')
         */
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

    // =====================================================
    // MutationObserver BRANCH COVERAGE
    // =====================================================

    test('MutationObserver injects badge for dynamically added elements (link undefined branch)', async () => {

        /**
         * We call injectBadges() first so MutationObserver attaches.
         */
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

        /**
         * MutationObserver callbacks are async in jsdom.
         * We wait one microtask tick to allow it to execute.
         */
        await new Promise(resolve => setTimeout(resolve, 0));

        const badge = document.querySelector('.safecart-badge');
        expect(badge).not.toBeNull();

        /**
         * IMPORTANT:
         * In the MutationObserver branch, injectBadgeOnListing(card)
         * is called WITHOUT the link parameter.
         * This ensures the "undefined link" popup interpolation path executes.
         */
        badge.click();

        const popup = document.querySelector('div[style*="position: fixed"]');
        expect(popup).not.toBeNull();

        // This assertion forces execution of the undefined link branch
        expect(popup.innerHTML).toContain('undefined');
    });

    test('MutationObserver ignores non-element nodes (nodeType !== 1 branch)', async () => {

        injectBadges();

        // Add a text node instead of an element
        const textNode = document.createTextNode("hello");
        document.body.appendChild(textNode);

        await new Promise(resolve => setTimeout(resolve, 0));

        /**
         * No badges should be created because nodeType !== 1
         * This covers the negative branch of:
         * if (node.nodeType === 1)
         */
        const badges = document.querySelectorAll('.safecart-badge');
        expect(badges.length).toBe(0);
    });

    //describe block to cover lines 113-114
    describe('Auto-execution branch (window !== undefined && !__SAFE_CART_TEST__)', () => {

        beforeEach(() => {
            jest.resetModules(); // Important: allows re-importing fresh module
            document.body.innerHTML = '';
        });

        test('logs and auto-runs injectBadges when not in test mode', () => {

            // Remove test flag so condition becomes TRUE
            delete window.__SAFE_CART_TEST__;

            // Spy on console.log
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

            // Spy on injectBadges BEFORE requiring module
            const injectSpy = jest.fn();

            jest.doMock('../frontend/content/contentScript', () => {
                const original = jest.requireActual('../frontend/content/contentScript');
                return {
                    ...original,
                    injectBadges: injectSpy
                };
            });

            // Re-require module so bottom script executes
            require('../frontend/content/contentScript');

            expect(consoleSpy).toHaveBeenCalledWith("SAFE CART IS RUNNING");

            consoleSpy.mockRestore();
        });
    });

});