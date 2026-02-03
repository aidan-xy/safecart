let title;
let productRating;
let reviews;
let price


function gatherReview() {
  reviews = document.querySelectorAll('div[class="list--itemReview--d9Z9Z5Z"]');
}

function gatherTitle() {
  title = document.querySelector('h1[data-pl="product-title"]');
}

function gatherRating() {
  productRating = document.querySelector('a[class="reviewer--rating--xrWWFzx"] strong');
}

function gatherPrice() {
  price = document.querySelector('span[class="price-default--current--F8OlYIo"]');
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    if(request.action === "getData") {
        gatherReview();
        gatherTitle();
        gatherRating();

        if(title) {
            console.log(title.textContent);
        }
        if(productRating) {
            console.log(productRating.textContent);
        }
        if(reviews && reviews.length > 0) {
            let numOfWordReview = 1; 
            for(let i = 0; i < reviews.length; i++) {
                if(reviews[i].textContent.length > 0) {
                    console.log("review " + numOfWordReview + ": " + reviews[i].textContent);
                    numOfWordReview++;
                }
            }
        }


        const reviewsArray = [];
        if(reviews && reviews.length > 0) {
            for(let i = 0; i < reviews.length; i++) {
                reviewsArray.push(reviews[i].textContent);
            }
        } else {
            console.log("NO REVIEWS FOUND!");
        }
            console.log("Final reviewsArray:", reviewsArray);
            console.log("reviewsArray length:", reviewsArray.length);

        console.log("reviewsArray length:", reviewsArray.length);
        sendResponse({title: title ? title.textContent : "no value yet", 
            reviews: reviewsArray, 
            productRating: productRating ? productRating.textContent: "no value yet"});
    }
    return true;
})