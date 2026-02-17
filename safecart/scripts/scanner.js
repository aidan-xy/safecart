
function gatherReview() {
  const reviews = document.querySelectorAll('div[class="list--itemReview--d9Z9Z5Z"]');
  const reviewsArray = [];
  if(reviews && reviews.length > 0) {
    for(let i = 0; i < reviews.length; i++) {
    reviewsArray.push(reviews[i].textContent);
    console.log("recording reviews: " + reviews[i].textContent);
    }
  }
  return reviewsArray
}

function gatherTitle() {
  const title = document.querySelector('h1[data-pl="product-title"]');
  console.log("recording the title: " + (title ? title.textContent : "no value yet"));
  return title ? title.textContent : "no value yet"
}

function gatherRating() {
  const productRatingHTML = document.querySelector('a[class="reviewer--rating--xrWWFzx"] strong');
  if(!productRatingHTML){
    console.log("recording the product ratings " + 0);
    return 0
  }
  const productRating = productRatingHTML.textContent.match(/\d{1}.\d{1}/)
  console.log("recording the product ratings " + (productRating ? parseFloat(productRating [0]): 0));
  return productRating ? parseFloat(productRating [0]): 0
}

function gatherPrice() {
  const listingPrice = document.querySelector('span[class="price-default--current--F8OlYIo"]');
  if(!listingPrice){
    console.log("recording the product price: 0")
    return 0
  }
  const match = listingPrice.textContent.match(/\d+\.\d{2}/)
  console.log("recording the product price: " + (match ? parseFloat(match[0]): 0));
  return match ? parseFloat(match[0]): 0
}

function gatherNumSold() {
  const numSoldHTML = document.querySelector('span[class="reviewer--sold--ytPeoEy"]');
  if(!numSoldHTML){
    console.log("recording the number sold: 0");
    return 0
  }
  const numSold = numSoldHTML.textContent.match(/[\d,]+/)
  console.log("recording the number sold: " + (numSold ? parseInt(numSold[0].replace(/,/g, '')): 0));
  return numSold ? parseInt(numSold[0].replace(/,/g, '')): 0 
}

function gatherNumberImage() {
  const numberImageImage = document.querySelector('span[class="comet-icon comet-icon-photo filter--labelIcon--O0LEQIg"]');
  if(!numberImageImage){
    console.log("recording the number of images: 0");
    return 0
  }
  const numberImageImageParent = numberImageImage.parentElement
  if(!numberImageImageParent){
    console.log("recording the number of images: 0");
    return 0
  }
  const numberImage = numberImageImageParent.textContent.match(/\d+/)
  console.log("recording the number of images: " + numberImage ? parseInt(numberImage[0]) : 0);
  return numberImage ? parseInt(numberImage[0]) : 0;
}
function gatherNumberRatings() {
  const numberOfRatingsHTML = document.querySelector('a[class="reviewer--reviews--cx7Zs_V"]');
  if(!numberOfRatingsHTML){
    console.log("recording the number of reviews: 0");
    return 0
  }
  const numberOfRatings = numberOfRatingsHTML.textContent.match(/\d+/)
  console.log("recording the number of reviews: " + (numberOfRatings ? parseFloat(numberOfRatings[0]) : 0));
  return numberOfRatings ? parseFloat(numberOfRatings[0]) : 0;
}

function gatherOpenSinceDate() {
  let date;
  ageHTML = document.querySelector('div[class="store-detail--storeInfo--BMDFsTB"]');
  if(ageHTML) {
    const eachInfo = ageHTML.querySelectorAll('td');
    for (let i = 0; i < eachInfo.length; i++) {
      if (eachInfo[i].textContent.trim() === 'Open since:') {
        date = eachInfo[i + 1]
        break
      }
    }
    console.log("recording opening date: " + (date ? date.textContent.trim() : "can't find"))
    return date ? date.textContent.trim() : "march, 22 2006";
  } else{
    console.log("recording opening date: can't find")
    return "march, 22 2006"
  }

}

function gatherAge() {
  const ageHTML = document.querySelector('div[class="store-detail--storeInfo--BMDFsTB"]');
  let age = 0;
  if(ageHTML) {
    const dateStr = gatherOpenSinceDate();
    const targetDate = new Date(dateStr);
    const today = new Date();
    age = ((today.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
    age = Math.round(age * 100)/100
  } else {
    age = 0
  }
  console.log("calculating the age of the company: " + age);
  return age
}

function getAllInformationForSimpleAGI() {
  const infoForSimpleAGI = {productRating : gatherRating(), 
                            numSold: gatherNumSold(), 
                            ageYears: gatherAge(),
                            numRating: gatherNumberRatings(),
                            reviewImages: gatherNumberImage()}
  console.log("calling the function to collect info for infoForSimpleAGI")
  return infoForSimpleAGI
}


//listening for any query
//commenting everything here since it is not needed yet
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  //button is pressed
    //check if the request is called "get data"
  if(request.action === "getData") {
    const infoForSimpleAGI = getAllInformationForSimpleAGI();
    console.log("sending info to controller")
    sendResponse(infoForSimpleAGI);
  }
  return true;
})

module.exports = {
  gatherTitle,
  gatherRating,
  gatherPrice,
  gatherNumSold,
  gatherReview,
  gatherNumberImage,
  gatherNumberRatings,
  gatherAge,
  gatherOpenSinceDate
};