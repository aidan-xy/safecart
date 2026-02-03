chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {action: "getData"}, (response) => {
        if(response) {
            document.getElementById("title").textContent = response.title;
            document.getElementById("rating").textContent = response.rating;
            const reviewList = document.getElementById("reviews-list");
            const responseReview = response.reviews;
            reviewList.innerHTML = "";
            console.log(responseReview.length);
            for(let i = 0; i < responseReview.length; i++) {
                let newElem = document.createElement("li");
                newElem.textContent = "review " + i + ": " + responseReview[i];
                reviewList.append(newElem);
            }
        }
    })
})