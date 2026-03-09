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
    }
  }
  console.log("recording review: ");
  console.log(reviewsArray);
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
  let productRatingHTML;
  if(currPageType(doc) === "listing") {
    productRatingHTML = doc.querySelector('a[class="reviewer--rating--xrWWFzx"] strong');
  } else {
    productRatingHTML = doc.querySelector('a[class="reviewer--rating--xrWWFzx pdp-index-disable-pointer"] strong');
  }

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
  let listingPrice;
  if(currPageType(doc) === "listing") {
    listingPrice = doc.querySelector('span[class="price-default--current--F8OlYIo"]');
  } else {
    listingPrice = doc.querySelector('span[class="price-default--current--F8OlYIo"]');
  }

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
  let numSoldHTML;
  if(currPageType(doc) === "listing") {
    numSoldHTML = doc.querySelector('span[class="reviewer--sold--ytPeoEy"]');
  } else {
    numSoldHTML = doc.querySelector('span[class="reviewer--sold--ytPeoEy"]');
  }

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
  let numberImage;
  if(currPageType(doc) === "listing") {
    const numberImageImage = doc.querySelector('span[class="comet-icon comet-icon-photo filter--labelIcon--O0LEQIg"]');
    if(!numberImageImage){
      console.log("could not see number of images element");
      return 0;
    }
    const numberImageImageParent = numberImageImage.parentElement;
    numberImage = numberImageImageParent.textContent.match(/\d+/);
  } else {
    const numberImageHTML = doc.querySelector('div[class="ae-filter-tab-list"]');
    if(numberImageHTML) {
      const eachText = numberImageHTML.querySelectorAll('div[class="ae-filter-tab-item-text"]');
      const eachNumber = numberImageHTML.querySelectorAll('div[class="ae-filter-tab-item-num"]');
      for (let i = 0; i < eachText.length; i++) {
        if (eachText[i].textContent.trim() === 'Pic review') {
          numberImageText = eachNumber[i];
          break;
        }
      }
      numberImage = numberImageText.textContent.match(/\d+/);
    } else{
      console.log("could not see number of images element");
      return 0;
    }
  }

  console.log("Number of images element: " + (numberImage ? parseInt(numberImage[0]) : 0));
  return numberImage ? parseInt(numberImage[0]) : 0;
}

/** 
*Calculating the age based on today dates and the store dates
* @return {number} the number of ratings
*/
function gatherNumberRatings(doc = document) {
  let numberOfRatingsHTML;
  if(currPageType(doc) === "listing") {
    numberOfRatingsHTML = doc.querySelector('a[class="reviewer--reviews--cx7Zs_V"]');
  } else {
    numberOfRatingsHTML = doc.querySelector('a[class="reviewer--reviews--cx7Zs_V pdp-index-disable-pointer"]');
  }
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
  if(currPageType(doc) === "listing") {
    ageHTML = doc.querySelector('div[class="store-detail--storeInfo--BMDFsTB"]');
  } else {
    ageHTML = doc.querySelector('div[class="store-detail--storeInfo--BMDFsTB"]');
  }
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
  let age = 0;
  const dateStr = gatherOpenSinceDate(doc = document);
  if(dateStr !== "") {
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
function gatherSearchedPrices(doc = document) {
  //take the lowest html that contain all of the prices
  let priceArray = [];
  const allListingHTML = doc.querySelector('div[data-spm="main"]');
  if(allListingHTML) {
    //look into the html with the pirces
    const eachInfo = allListingHTML.querySelectorAll('div[aria-label]:not([title])');
    for (let i = 0; i < eachInfo.length; i++) {
        //grab the prices
        let newProductPriceStringWithDollar = eachInfo[i].getAttribute("aria-label");
        if(newProductPriceStringWithDollar) {
          //parse the string from the dollarsign
          let newProductPriceString = newProductPriceStringWithDollar.match(/[\d,]+\.\d{1,2}/);
          //turn it into a float
          let newProductPrice = parseFloat( newProductPriceString[0].replace(/,/g, ''));
          priceArray.push(newProductPrice);
          console.log("price element: " + newProductPrice);
        }
    }
  }
  return priceArray;
}

//potentially scrapped function
/** 
*take all the link for the search listing
* @param {string} html element in string 
* @return {string[]} all the link for each of the product on the page
*/
// function gatherProductLinks(doc = document) {
//   //take the lowest html that contain all of the prices
//   let productArray = [];
//   const allListingHTML = doc.querySelector('div[class="hr_hs"]');
//   if(allListingHTML) {
//     //look into the html with the pirces
//     const eachInfo = allListingHTML.querySelectorAll('a[class="l0_b im_ir search-card-item"]');
//     for (let i = 0; i < eachInfo.length; i++) {
//         //grab the prices
//         let productLink = eachInfo[i].getAttribute("href");
//         if(productLink) {
//           productArray.push(productLink);
//           console.log("link element: " + productLink);
//         }
//     }
//   }
//   return productArray;
// }

/** 
*take the average of all the price in gatherSearchedPrices()
* @param {string} html element in string 
* @return {number} the average price of the whole page
*/
function computeAveragePrice(doc = document) {
  console.log("computing average price");
  const prices = gatherSearchedPrices(doc);
  if(!prices || prices.length === 0) {
    return -1;
  } else {
    let total = 0;
    for(let i = 0; i < prices.length; i++) {
      total += prices[i];
    }
    const avgPrice = (total/ prices.length).toFixed(2)
    console.log("average price: " + computeAveragePrice(doc));
    return parseFloat(avgPrice);
  }
}

/** 
*take the average of all the price in gatherSearchedPrices()
* @return {string} a scaping url that is used based on the title
* of the current listing
*/
function createURLForSearchPage(url = window.location.href) {
  let title = gatherTitle();
  if(title === "no value yet" || title === "") {
    console.log("can't find title element")
    return "error: can't find the title";
  }
  title = title.replace(/ /g, '-');
  if(title.length > 50) {
    title = title.slice(0,50);
  }
  if(url.includes("https://www.aliexpress.us/item/")){

    title = "https://www.aliexpress.us/w/wholesale-" + title + ".html";
  } else {
    title = "https://www.aliexpress.com/w/wholesale-" + title + ".html";
  }
  console.log("scraping: " + title);
  return title;
}

/**getting all the information for the simpleTrustAIg() class
* @return {record}: things that are useful for simple AIg
*/
function getAllInformationForAlg(doc = document) {
  const infoForAlg = {listingPrice: gatherPrice(doc),
                      productRating: gatherRating(doc), 
                      numSold: gatherNumSold(doc), 
                      ageYears: gatherAge(doc),
                      numRating: gatherNumberRatings(doc),
                      reviewImages: gatherNumberImage(doc)};
  
  return infoForAlg;
}

//potentially scrap function
/**getting all the information for the simpleTrustAlg() class
* @return {record}: a record containg all the product link of the current page,
* and the average price
*/
// function getInfoForSearchPage(doc = document) {
//   const InfoForSearchPage = {avgPrice: computeAvargePrice(doc),
//                               listingLinks: gatherProductLinks(doc)};
  
//   return InfoForSearchPage;
// }

/**getting all the information for the simpleTrustAlg() class
* @return {string}: a string indenitfying what type of page 
* the user is currently on 
* listing: on a listing page
* search: on a search page
*/
function currPageType(doc = document) {
  let elementType = doc.querySelector("body[data-spm='productlist']");
  if(!elementType) {elementType = doc.querySelector("body[data-spm='detail']");}
  if(!elementType) {elementType = doc.querySelector("body[data-spm='tm1000015626']");}
  if(!elementType) {
    return "unknown"
  }
  if(elementType.getAttribute("data-spm") === "detail") {
    return "listing";

  //this is a else if(elementType.getAttribute("data-spm") === "productlist")
  } else if (elementType.getAttribute("data-spm") === "productlist") {
    return "search";
  } else {
    return "for you";
  }
}


//listening for any query
//commenting everything here since it is not needed yet
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  //button is pressed
  // this is for the current product page
  let doc = document
  if(request.html) {
    const parser = new DOMParser();
    doc = parser.parseFromString(request.html, 'text/html');
    // doc = request.html
  }
  //get all the needed data for listing page
  if(request.action === "getData") {
    const infoForSimpleAlg = getAllInformationForAlg(doc);
    sendResponse(infoForSimpleAlg);
  //getting all the needed data for the search page
  } else if(request.action === "getDataFromSearch") {
    const avgPrice = computeAveragePrice(doc);
    sendResponse({averagePrice: avgPrice});
  // get what type of page it is, if is a
  // and use this to first idenitfy what page,
  // then either use getDataFromSearch or, getData 
  } else if(request.action === "pageType") {
    sendResponse({pageType: currPageType(doc)});
  //get the url that put the listing title into the search bar
  } else if(request.action === "getURLToScapeForListing") {
    sendResponse({URLToScape: createURLForSearchPage()})
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
  getAllInformationForAlg,
  gatherSearchedPrices,
  computeAveragePrice,
  createURLForSearchPage,
  currPageType
}
