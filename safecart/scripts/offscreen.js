chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    console.log("Offscreen: Received message", message);

    if (message.action === "loadPage") {
        console.log("Offscreen: Handling loadPage for URL:", message.url);

        try {
            console.log("Offscreen: Creating iframe");
            // Create an iframe to load the page
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none'; // Hide the iframe
            document.body.appendChild(iframe);

            console.log("Offscreen: Setting iframe src");
            // Load the URL
            iframe.src = message.url;

            console.log("Offscreen: Waiting for load");
            // Wait for the page to load
            await new Promise((resolve, reject) => {
                iframe.onload = () => {
                    console.log("Offscreen: Iframe loaded successfully");
                    resolve();
                };
                iframe.onerror = (e) => {
                    console.log("Offscreen: Iframe load error", e);
                    reject(new Error('Iframe load failed'));
                };
                // Timeout after 30 seconds
                setTimeout(() => {
                    console.log("Offscreen: Load timeout");
                    reject(new Error('Page load timeout'));
                }, 30000);
            });

            console.log("Offscreen: Attempting to access contentDocument");
            // Get the full HTML including dynamically loaded content
            const html = iframe.contentDocument.documentElement.outerHTML;

            console.log("Offscreen: HTML retrieved, length:", html.length);
            // Clean up
            document.body.removeChild(iframe);

            console.log("Offscreen: Sending success response");
            sendResponse({
                success: true,
                html: html
            });

        } catch (err) {
            console.error("Offscreen: LOAD ERROR:", err);
            console.log("Offscreen: Sending error response");
            sendResponse({
                success: false,
                error: err.message
            });
        }

        return true;
    }

});
