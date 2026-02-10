const scanner = require("../scripts/scanner");
const localHtmlPage = require("localHTMLpage/SOYES XS19 Mini Smartphone 3.88in 2GB RAM 16GB ROM Android10.0 With Facial Recognition Dual SIM Standby 3G Network Small Phone.html");
const fs = requires("fs")

describe('parsingTest', () => {

  const html = fs.readFileSync("./SOYES XS19 Mini Smartphone 3.88in 2GB RAM 16GB ROM Android10.0 With Facial Recognition Dual SIM Standby 3G Network Small Phone.html","utf-8");

  document.documentElement.innerHTML = html;

  title = gatherTitle()
  rating = gatherRating()
  price = gatherPrice()
  numSold= gatherNumSold()
  reviews = gatherReview()
  
  let reviewsTest = ["The product works well and sounds good; it has YouTube and Android 10.",
              "Thank you it’s my first time having a small smart phone now the only thing got to get is a sim card",
              "Smaller than expected however i was thinking just a little bit bigger nonetheless it's still a nice phone , take a sims call, i going to take it to boost or t mobile and see if they can help me out with a service plan or something.. Still a nice person for a reasonable price."]

  test(expect(title).toEqual("SOYES XS19 Mini Smartphone 3.88in 2GB RAM 16GB ROM Android10.0 With Facial Recognition Dual SIM Standby 3G Network Small Phone"));
  test(expect(price).toEqual("$32.27"));
  test(expect(rating).toEqual("  4.4  "));
  
  test(expect(numSold).toEqual("800+ sold"))
  for(let i = 0; i < reviewsTest.length; i++){
    test(expect(reviews[i]).toEqual(reviewsTest[i]))
  }

});