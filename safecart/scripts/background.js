/**
 * Handles messages from content scripts or popup, specifically for fetching full HTML of a URL.
 * Creates a new tab with the provided URL, waits for it to load, executes a script to retrieve
 * the document's outer HTML, closes the tab, and sends the HTML back as a response.
 * @param {Object} message - The message object containing action and url properties.
 * @param {Object} sender - Information about the sender of the message.
 * @param {Function} sendResponse - Function to send a response back to the sender.
 * @returns {boolean} Returns true to keep the message port open for asynchronous response.
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    if (message.action === "fetchFullHTML") {
        console.log("Received fetchFullHTML request for URL:", message.url);

        // Create a new tab with the URL
        chrome.tabs.create({ url: message.url, active: false }, (tab) => {
            if (chrome.runtime.lastError) {
                console.error("Tab creation error:", chrome.runtime.lastError);
                sendResponse({
                    success: false,
                    error: chrome.runtime.lastError.message
                });
                return;
            }

            console.log("Tab created, ID:", tab.id);
            const tabId = tab.id;

            // Listen for tab load completion
            const onUpdated = (tabIdUpdated, changeInfo, tabInfo) => {
                if (tabIdUpdated === tabId && changeInfo.status === 'complete') {
                    console.log("Tab loaded, executing script");
                    chrome.tabs.onUpdated.removeListener(onUpdated);

                    // Execute script to get the full HTML
                    chrome.scripting.executeScript({
                        target: { tabId: tabId },
                        function: () => document.documentElement.outerHTML
                    }, (results) => {
                        console.log("Script executed, results:", results);
                        // Close the tab
                        chrome.tabs.remove(tabId);

                        if (chrome.runtime.lastError) {
                            console.error("Script execution error:", chrome.runtime.lastError);
                            sendResponse({
                                success: false,
                                error: chrome.runtime.lastError.message
                            });
                        } else if (results && results[0] && results[0].result) {
                            console.log("HTML retrieved, length:", results[0].result.length);
                            /*
                            // Open the HTML in a new tab for inspection
                            chrome.tabs.create({
                                url: 'data:text/html;charset=utf-8,' + encodeURIComponent(results[0].result),
                                active: false
                            });
                            */
                            sendResponse({
                                success: true,
                                html: results[0].result
                            });
                        } else {
                            console.log("No results from script");
                            sendResponse({
                                success: false,
                                error: 'Failed to retrieve HTML'
                            });
                        }
                    });
                }
            };

            chrome.tabs.onUpdated.addListener(onUpdated);
        });

        return true; // Keep port open for async response
    }
});
