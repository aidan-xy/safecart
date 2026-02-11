//Check if this is a active tab, and that it is the current tab
chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
  //Ask the whole extension that is active in the tab to "getData"
  chrome.tabs.sendMessage(tabs[0].id, {action: "getData"}, (response) => {
    if(response) {
      //changing the element of the popup.html based on the data recived
      document.getElementById("title").textContent = response.title;
      document.getElementById("rating").textContent = response.productRating;
      document.getElementById("listingPrice").textContent = response.listingPrice;
      document.getElementById("numSold").textContent = response.numSold;

      //look throught the reivew list from the response and slowly append it to 
      //the <ul> review-list 
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