/** 
*Calculating the age based on today dates and the store dates
* @return {string[]} an array of reviews for the product
*/
function gatherReview(doc = document) {
  const reviews = doc.querySelectorAll('div[class="list--itemReview--d9Z9Z5Z"]');
  const reviewsArray = [];
  if(reviews && reviews.length > 0) {
    for(let i = 0; i < reviews.length; i++) {
    reviewsArray.push(reviews[i].textContent);
    console.log("recording review " + (i + 1) + " : " + reviews[i].textContent);
    }
  }
  return reviewsArray;
}

/** 
*Calculating the age based on today dates and the store dates
* @return {string} the product title
*/
function gatherTitle(doc = document) {
  const title = doc.querySelector('h1[data-pl="product-title"]');
  console.log("Title element: " +  (title ? title.textContent : "no value yet"));
  return title ? title.textContent : "no value yet";
}

/** 
*Calculating the age based on today dates and the store dates
* @return {number} the rating of the product
*/
function gatherRating(doc = document) {
  const productRatingHTML = doc.querySelector('a[class="reviewer--rating--xrWWFzx"] strong');
  if(!productRatingHTML){
    console.log("could not see rating element");
    return 0;
  }
  const productRating = productRatingHTML.textContent.match(/\d{1}.\d{1}/);
  console.log("Rating element: " +  (productRating ? parseFloat(productRating [0]): 0));
  return productRating ? parseFloat(productRating [0]): 0;
}

/** 
*Calculating the age based on today dates and the store dates
* @return {number} the price of the product
*/
function gatherPrice(doc = document) {
  const listingPrice = doc.querySelector('span[class="price-default--current--F8OlYIo"]');
  if(!listingPrice){
    console.log("could not see product price element");
    return 0;
  }
  const match = listingPrice.textContent.match(/[\d,]+\.\d{2}/);
  console.log("Product price element: " + (match ? parseFloat(match[0]): 0));
  return match ? parseFloat(match[0].replace(/,/g, '')): 0;
}


/** 
*Calculating the age based on today dates and the store dates
* @return {number} the number of product sold
*/
function gatherNumSold(doc = document) {
  const numSoldHTML = doc.querySelector('span[class="reviewer--sold--ytPeoEy"]');
  if(!numSoldHTML){
    console.log("could not see num sold element");
    return 0;
  }
  const numSold = numSoldHTML.textContent.match(/[\d,]+/)
  console.log("Num sold element: " + (numSold ? parseInt(numSold[0].replace(/,/g, '')): 0));
  return numSold ? parseInt(numSold[0].replace(/,/g, '')): 0;
}

/** 
*Calculating the age based on today dates and the store dates
* @return {number} the number of images
*/
function gatherNumberImage(doc = document) {
  const numberImageImage = doc.querySelector('span[class="comet-icon comet-icon-photo filter--labelIcon--O0LEQIg"]');
  if(!numberImageImage){
    console.log("could not see number of images element");
    return 0;
  }
  const numberImageImageParent = numberImageImage.parentElement;
  const numberImage = numberImageImageParent.textContent.match(/\d+/);
  console.log("Number of images element: " + (numberImage ? parseInt(numberImage[0]) : 0));
  return numberImage ? parseInt(numberImage[0]) : 0;
}

/** 
*Calculating the age based on today dates and the store dates
* @return {number} the number of ratings
*/
function gatherNumberRatings(doc = document) {
  const numberOfRatingsHTML = doc.querySelector('a[class="reviewer--reviews--cx7Zs_V"]');
  if(!numberOfRatingsHTML){
    console.log("could not see number of ratings element");
    return 0;
  }
  const numberOfRatings = numberOfRatingsHTML.textContent.match(/\d+/);
  console.log("Number of ratings element: " + (numberOfRatings ? parseFloat(numberOfRatings[0]) : 0));
  return numberOfRatings ? parseFloat(numberOfRatings[0]) : 0;
}

/** 
*Calculating the age based on today dates and the store dates
* @return {string} the opening date in string
*/
function gatherOpenSinceDate(doc = document) {
  let date;
  ageHTML = doc.querySelector('div[class="store-detail--storeInfo--BMDFsTB"]');
  if(ageHTML) {
    const eachInfo = ageHTML.querySelectorAll('td');
    for (let i = 0; i < eachInfo.length; i++) {
      if (eachInfo[i].textContent.trim() === 'Open since:' && eachInfo[i + 1].textContent.trim() != "") {
        date = eachInfo[i + 1];
        break;
      }
    }
    console.log("Open since date element: " +  (date ? date.textContent.trim() : ""));
    return date ? date.textContent.trim() : "";
  } else{
    console.log("Could not see open since date element");
    return "";
  }

}
/** 
*Calculating the age based on today dates and the store dates
* @return {Number} the age rounded to the nearest 100th
*/
function gatherAge(doc = document) {
  const ageHTML = doc.querySelector('div[class="store-detail--storeInfo--BMDFsTB"]');
  let age = 0;
  if(ageHTML && gatherOpenSinceDate() !== "") {
    const dateStr = gatherOpenSinceDate();
    const targetDate = new Date(dateStr);
    const today = new Date();
    age = ((today.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
    age = Math.round(age * 100)/100;
    console.log("caluclated age :" + age);
  } else {
    console.log("could not caluclate age");
    age = 0;
  }
  return age;
}

/** 
* function is taking all the prices that is visible from the search page
*
* @param {string} html element in string 
* @return {number[]}
*/
function gatherSearchedPrices() {
  //take the lowest html that contain all of the prices
  let priceArray = [];
  const allListingHTML = doc.querySelector('div[class="hr_hs"]');
  if(allListingHTML) {
    //look into the html with the pirces
    const eachInfo = allListingHTML.querySelectorAll('div[class="l0_e1"]');
    for (let i = 0; i < eachInfo.length; i++) {
        //grab the prices
        let newProductPriceStringWithDollar = eachInfo[i].getAttribute("aria-label");
        if(newProductPriceStringWithDollar) {
          //parse the string from the dollarsign
          let newProductPriceString = newProductPriceStringWithDollar.match(/[\d,]+(\.\d{1,2})?/);
          //turn it into a float
          let newProductPrice = parseFloat(newProductPriceString);
          priceArray.push(newProductPrice);
          console.log("price element: " + newProductPrice);
        }
    }
  }
  return priceArray;
}

/** 
*take the average of all the price in gatherSearchedPrices()
* @param {string} html element in string 
* @return {number} the average price of the whole page
*/
function computeAvargePrice(doc = document) {
  const prices = gatherSearchedPrices(doc);
  if(!prices) {
    return -1;
  } else {
    let total = 0;
    for(let i = 0; i < prices.length; i++) {
      total += prices[i];
    }
    const avgPrice = (total/ prices.length).toFixed(2)
    return (avgPrice);
  }
}

//getting all the information for the simpleTrustAGI() class
//output: record
function getAllInformationForSimpleAGI(doc = document) {
  const infoForSimpleAGI = {productRating : gatherRating(doc), 
                            numSold: gatherNumSold(doc), 
                            ageYears: gatherAge(doc),
                            numRating: gatherNumberRatings(doc),
                            reviewImages: gatherNumberImage(doc)};
  
  return infoForSimpleAGI;
}


//listening for any query
//commenting everything here since it is not needed yet
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  //button is pressed
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
  gatherOpenSinceDate,
  getAllInformationForSimpleAGI
};