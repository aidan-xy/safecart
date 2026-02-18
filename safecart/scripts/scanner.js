//Gathering and parsing the element for the reviews element
//output: array of strings
function gatherReview() {
  const reviews = document.querySelectorAll('div[class="list--itemReview--d9Z9Z5Z"]');
  const reviewsArray = [];
  if(reviews && reviews.length > 0) {
    for(let i = 0; i < reviews.length; i++) {
    reviewsArray.push(reviews[i].textContent);
    console.log("recording review " + (i + 1) + " : " + reviews[i].textContent);
    }
  }
  return reviewsArray;
}

//Gathering and parsing the html for the title element
//output: string
function gatherTitle() {
  const title = document.querySelector('h1[data-pl="product-title"]');
  console.log("Title element: " +  (title ? title.textContent : "no value yet"));
  return title ? title.textContent : "no value yet";
}

//Gathering and parsing the html for the rating element
//output: number
function gatherRating() {
  const productRatingHTML = document.querySelector('a[class="reviewer--rating--xrWWFzx"] strong');
  if(!productRatingHTML){
    console.log("could not see rating element");
    return 0;
  }
  const productRating = productRatingHTML.textContent.match(/\d{1}.\d{1}/);
  console.log("Rating element: " +  (productRating ? parseFloat(productRating [0]): 0));
  return productRating ? parseFloat(productRating [0]): 0;
}

//Gathering and parsing the html for the number sold element
//output: number
function gatherPrice() {
  const listingPrice = document.querySelector('span[class="price-default--current--F8OlYIo"]');
  if(!listingPrice){
    console.log("could not see product price element");
    return 0;
  }
  const match = listingPrice.textContent.match(/[\d,]+\.\d{2}/);
  console.log("Product price element: " + (match ? parseFloat(match[0]): 0));
  return match ? parseFloat(match[0].replace(/,/g, '')): 0;
}

//Gathering and parsing the html for the number sold element
//output: number
function gatherNumSold() {
  const numSoldHTML = document.querySelector('span[class="reviewer--sold--ytPeoEy"]');
  if(!numSoldHTML){
    console.log("could not see num sold element");
    return 0;
  }
  const numSold = numSoldHTML.textContent.match(/[\d,]+/)
  console.log("Num sold element: " + (numSold ? parseInt(numSold[0].replace(/,/g, '')): 0));
  return numSold ? parseInt(numSold[0].replace(/,/g, '')): 0;
}

//Gathering and parsing the html for the number of images element
//output: number
function gatherNumberImage() {
  const numberImageImage = document.querySelector('span[class="comet-icon comet-icon-photo filter--labelIcon--O0LEQIg"]');
  if(!numberImageImage){
    console.log("could not see number of images element");
    return 0;
  }
  const numberImageImageParent = numberImageImage.parentElement;
  const numberImage = numberImageImageParent.textContent.match(/\d+/);
  console.log("Number of images element: " + (numberImage ? parseInt(numberImage[0]) : 0));
  return numberImage ? parseInt(numberImage[0]) : 0;
}

//Gathering and parsing the html for the number of ratings element
//output: number
function gatherNumberRatings() {
  const numberOfRatingsHTML = document.querySelector('a[class="reviewer--reviews--cx7Zs_V"]');
  if(!numberOfRatingsHTML){
    console.log("could not see number of ratings element");
    return 0;
  }
  const numberOfRatings = numberOfRatingsHTML.textContent.match(/\d+/);
  console.log("Number of ratings element: " + (numberOfRatings ? parseFloat(numberOfRatings[0]) : 0));
  return numberOfRatings ? parseFloat(numberOfRatings[0]) : 0;
}

//Gathering and parsing the html for the open date element
//output: string
function gatherOpenSinceDate() {
  let date;
  ageHTML = document.querySelector('div[class="store-detail--storeInfo--BMDFsTB"]');
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

//Calculating the age based on today dates and the store dates
//output: number
function gatherAge() {
  const ageHTML = document.querySelector('div[class="store-detail--storeInfo--BMDFsTB"]');
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

//getting all the information for the simpleTrustAGI() class
//output: record
function getAllInformationForSimpleAGI() {
  const infoForSimpleAGI = {productRating : gatherRating(), 
                            numSold: gatherNumSold(), 
                            ageYears: gatherAge(),
                            numRating: gatherNumberRatings(),
                            reviewImages: gatherNumberImage()};
  
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