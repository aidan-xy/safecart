/**
 * @jest-environment jsdom
 */

window.__SAFE_CART_TEST__ = true;

// Mock React root rendering
jest.mock("react-dom/client", () => ({
    createRoot: jest.fn(() => ({
        render: jest.fn()
    }))
}));

const ReactDOM = require("react-dom/client");

const {
    injectBadgeOnListing,
    injectBadges
} = require("../frontend/content/contentScript");

global.chrome = {
    runtime: {
        getURL: jest.fn(() => "popup.css")
    }
};

describe("SafeCart Content Script", () => {

    beforeEach(() => {
        document.body.innerHTML = "";
        jest.clearAllMocks();
    });

    // =====================================================
    // injectBadgeOnListing()
    // =====================================================

    test("returns early when card is null", () => {
        expect(() => injectBadgeOnListing(null)).not.toThrow();
        expect(document.querySelector(".safecart-badge")).toBeNull();
    });

    test("returns early if badge already exists", () => {
        const card = document.createElement("div");
        document.body.appendChild(card);

        injectBadgeOnListing(card, "link1");
        injectBadgeOnListing(card, "link2");

        const badges = card.querySelectorAll(".safecart-badge");
        expect(badges.length).toBe(1);
    });

    test("injects badge with correct styling", () => {
        const card = document.createElement("div");
        document.body.appendChild(card);

        injectBadgeOnListing(card, "https://example.com");

        const badge = card.querySelector(".safecart-badge");

        expect(badge).not.toBeNull();
        expect(badge.style.borderRadius).toBe("50%");
        expect(badge.style.pointerEvents).toBe("auto");
        expect(card.style.position).toBe("relative");
        expect(badge.innerHTML).toContain("S");
    });

    test("clicking badge opens shadow DOM modal and close button removes it", () => {

        const card = document.createElement("div");
        document.body.appendChild(card);

        injectBadgeOnListing(card, "https://product.com");

        const badge = card.querySelector(".safecart-badge");

        badge.click();

        // Host overlay should exist
        const host = document.getElementById("safecart-overlay");
        expect(host).not.toBeNull();

        const shadowRoot = host.shadowRoot;
        expect(shadowRoot).not.toBeNull();

        // CSS link injected
        const link = shadowRoot.querySelector("link");
        expect(link).not.toBeNull();
        expect(chrome.runtime.getURL).toHaveBeenCalled();

        // React root should render
        expect(ReactDOM.createRoot).toHaveBeenCalled();

        // Close button
        const closeBtn = shadowRoot.querySelector("button");
        expect(closeBtn).not.toBeNull();

        closeBtn.click();

        expect(document.getElementById("safecart-overlay")).toBeNull();
    });

    test("clicking badge twice does not create duplicate overlays", () => {

        const card = document.createElement("div");
        document.body.appendChild(card);

        injectBadgeOnListing(card, "https://product.com");

        const badge = card.querySelector(".safecart-badge");

        badge.click();
        badge.click();

        const overlays = document.querySelectorAll("#safecart-overlay");
        expect(overlays.length).toBe(1);
    });

    // =====================================================
    // injectBadges() DOM scan
    // =====================================================

    test("injectBadges finds existing cards", () => {

        document.body.innerHTML = `
            <a href="https://example.com/product">
                <div>
                    <div>
                        <div>
                            <div class="nm_nn"></div>
                        </div>
                    </div>
                </div>
            </a>
        `;

        injectBadges();

        const badge = document.querySelector(".safecart-badge");
        expect(badge).not.toBeNull();
    });

    // =====================================================
    // MutationObserver coverage
    // =====================================================

    test("MutationObserver injects badge for dynamically added elements", async () => {

        injectBadges();

        const wrapper = document.createElement("div");

        wrapper.innerHTML = `
            <a href="https://dynamic.com/product">
                <div>
                    <div>
                        <div>
                            <div class="nm_nn"></div>
                        </div>
                    </div>
                </div>
            </a>
        `;

        document.body.appendChild(wrapper);

        await new Promise(r => setTimeout(r, 0));

        const badge = document.querySelector(".safecart-badge");
        expect(badge).not.toBeNull();
    });

    test("MutationObserver ignores non-element nodes", async () => {

        injectBadges();

        const textNode = document.createTextNode("hello");
        document.body.appendChild(textNode);

        await new Promise(r => setTimeout(r, 0));

        const badges = document.querySelectorAll(".safecart-badge");
        expect(badges.length).toBe(0);
    });

    // =====================================================
    // Auto execution branch
    // =====================================================

    describe("auto-execution when not in test mode", () => {

        beforeEach(() => {
            jest.resetModules();
            document.body.innerHTML = "";
        });

        test("logs and runs injectBadges", () => {

            delete window.__SAFE_CART_TEST__;

            const consoleSpy = jest
                .spyOn(console, "log")
                .mockImplementation(() => {});

            require("../frontend/content/contentScript");

            expect(consoleSpy).toHaveBeenCalledWith("SAFE CART IS RUNNING");

            consoleSpy.mockRestore();
        });
    });

});