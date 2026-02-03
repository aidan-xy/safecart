let title;
let productRating;
let reviews;
let price;
let numSold;

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

function gatherNumSold() {
    numSold = document.querySelector('span[class="reviewer--sold--ytPeoEy"]');
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    if(request.action === "getData") {
        gatherReview();
        gatherTitle();
        gatherRating();
        gatherPrice();

        const reviewsArray = [];
        if(reviews && reviews.length > 0) {
            for(let i = 0; i < reviews.length; i++) {
                reviewsArray.push(reviews[i].textContent);
            }
        }

        console.log(price.textContent);

        sendResponse({title: title ? title.textContent : "no value yet", 
            reviews: reviewsArray, 
            productRating: productRating ? productRating.textContent: 0});
    }
    return true;
})