
function gatherReview() : Array<string> {
  const reviews: NodeListOf<Element> = document.querySelectorAll('div[class="list--itemReview--d9Z9Z5Z"]');
  const reviewsArray: Array<string> = [];
  if(reviews && reviews.length > 0) {
    for(let i = 0; i < reviews.length; i++) {
    reviewsArray.push(reviews[i].textContent);
    }
  }
  return reviewsArray
}

function gatherTitle() : String {
  const title = document.querySelector('h1[data-pl="product-title"]');
  return title ? title.textContent : "no value yet"
}

function gatherRating() : number {
  const productRatingHTML = document.querySelector('a[class="reviewer--rating--xrWWFzx"] strong');
  if(!productRatingHTML){return 0}
  const productRating = productRatingHTML.textContent.match(/\d{1}.\d{1}/)
  return productRating ? parseFloat(productRating [0]): 0
}

function gatherPrice() : number {
  const listingPrice = document.querySelector('span[class="price-default--current--F8OlYIo"]');
  if(!listingPrice){return 0}
  const match = listingPrice.textContent.match(/\d+\.\d{2}/)
  return match ? parseFloat(match[0]): 0
}

function gatherNumSold() : number {
  const numSoldHTML = document.querySelector('span[class="reviewer--sold--ytPeoEy"]');
  if(!numSoldHTML){return 0}
  const numSold = numSoldHTML.textContent.match(/\d+/)
  return numSold ? parseInt(numSold[0]): 0 
}

function gatherNumberImage() : number {
  const numberImageImage = document.querySelector('span[class="comet-icon comet-icon-photo filter--labelIcon--O0LEQIg"]');
  if(!numberImageImage){return 0}
  const numberImageImageParent = numberImageImage.parentElement
  if(!numberImageImageParent){return 0}
  const numberImage = numberImageImageParent.textContent.match(/\d+/)
  return numberImage ? parseInt(numberImage[0]) : 0;
}
function gatherNumberRatings() : number {
  const numberOfRatingsHTML = document.querySelector('a[class="reviewer--reviews--cx7Zs_V"]');
  if(!numberOfRatingsHTML){return 0}
  const numberOfRatings = numberOfRatingsHTML.textContent.match(/\d+/)
  return numberOfRatings ? parseFloat(numberOfRatings[0]) : 0;
}

function gatherOpenSinceDate(): string {
  const ageHTML = document.querySelector('td[data-spm-anchor-id^="a2g0o.detail."]');
  if(!ageHTML) {return "march, 22 2006"}
  return ageHTML ? ageHTML.textContent : "march, 22 2006";
}

function gatherAge() : number {
  const ageHTML = document.querySelector('td[data-spm-anchor-id^="a2g0o.detail."]');
  let age = 0;
  if(ageHTML) {
    const dateStr = ageHTML.textContent;
    const targetDate = new Date(dateStr);
    const today = new Date();
    age = Math.floor((today.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
  } else {
    age = -1
  }
  return age
}

function getAllInformationForSimpleAGI() : Record<string, number> {
  const infoForSimpleAGI = {productRating : gatherRating(), 
                            numSold: gatherNumSold(), 
                            ageYears: gatherAge(),
                            numRating: gatherNumberRatings(),
                            reviewImages: gatherNumberImage()}
  
  return infoForSimpleAGI
}


//listening for any query
//commenting everything here since it is not needed yet
chrome.runtime.onMessage.addListener((request: { action: string }, sender: chrome.runtime.MessageSender, sendResponse: (response?: any)=> void) => {

    //check if the request is called "get data"
  if(request.action === "getData") {
    const infoForSimpleAGI = getAllInformationForSimpleAGI();
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