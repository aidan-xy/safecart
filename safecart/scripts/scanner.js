let title;
let productRating;
let reviews;
let listingPrice;
let numSold;

function gatherReview() {
  reviews = document.querySelectorAll('div[class="list--itemReview--d9Z9Z5Z"]');
  const reviewsArray = [];
  if(reviews && reviews.length > 0) {
    for(let i = 0; i < reviews.length; i++) {
    reviewsArray.push(reviews[i].textContent);
    }
  }
  return reviewsArray
}

function gatherTitle() {
  title = document.querySelector('h1[data-pl="product-title"]');
  return title ? title.textContent : "no value yet"
}

function gatherRating() {
  productRating = document.querySelector('a[class="reviewer--rating--xrWWFzx"] strong');
  return productRating ? productRating.textContent: 0
}

function gatherPrice() {
  listingPrice = document.querySelector('span[class="price-default--current--F8OlYIo"]');
  return listingPrice ? listingPrice.textContent: 0
}

function gatherNumSold() {
  numSold = document.querySelector('span[class="reviewer--sold--ytPeoEy"]');
  return numSold ? numSold.textContent: 0 
}

//listening for any query
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    //check if the request is called "get data"
  if(request.action === "getData") {

    gatherReview();
    gatherTitle();
    gatherRating();
    gatherPrice();
    gatherNumSold()

    //creating a an array and extract all of the html from the reviews
    //then put it in the array
    const reviewsArray = [];
    if(reviews && reviews.length > 0) {
      for(let i = 0; i < reviews.length; i++) {
        reviewsArray.push(reviews[i].textContent);
      }
    }

    //send all of the information called above and the extracted array
    sendResponse({title: title ? title.textContent : "no value yet", 
    reviews: reviewsArray, 
    productRating: productRating ? productRating.textContent: 0, 
    listingPrice: listingPrice ? listingPrice.textContent: 0,
    numSold: numSold ? numSold.textContent: 0});
  }
    return true;
})