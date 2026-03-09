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

jest.mock("")

const ReactDOM = require("react-dom/client");

const { injectBadgeOnListing, injectBadges } = require("../frontend/content/contentScript");

global.chrome = {
    runtime: {
        getURL: jest.fn(() => "popup.css"),
        sendMessage: jest.fn((msg, cb) => cb({ success: true, html: "<html></html>" })),
        onMessage: {
            addListener: jest.fn(() => null)
        }
    }
};

describe("SafeCart Content Script - simplified flow", () => {

    beforeEach(() => {
        document.body.innerHTML = "";
        jest.clearAllMocks();
    });

    test("injectBadgeOnListing main flow with badge click and auto-execution", async () => {
        // Setup a dummy card
        const card = document.createElement("div");
        const link = "https://product.com";
        document.body.appendChild(card);

        // Inject badge
        injectBadgeOnListing(card, link);

        const badge = card.querySelector(".safecart-badge");
        expect(badge).not.toBeNull();
        expect(card.style.position).toBe("relative");

        // Simulate badge click
        await badge.click();

        // Overlay and shadow DOM should exist
        const overlay = document.getElementById("safecart-overlay");
        expect(overlay).not.toBeNull();
        expect(overlay.shadowRoot).not.toBeNull();

        // CSS link injected
        const styleLink = overlay.shadowRoot.querySelector("link");
        expect(styleLink).not.toBeNull();
        expect(chrome.runtime.getURL).toHaveBeenCalled();

        // Close modal
        const closeBtn = overlay.shadowRoot.querySelector("button");
        expect(closeBtn).not.toBeNull();
        closeBtn.click();
        expect(document.getElementById("safecart-overlay")).toBeNull();

        // Auto-execution branch
        delete window.__SAFE_CART_TEST__;
        const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
        jest.resetModules();
        require("../frontend/content/contentScript");
        expect(consoleSpy).toHaveBeenCalledWith("SAFE CART IS RUNNING");
        consoleSpy.mockRestore();
    });

});