/**
 * @jest-environment jsdom
 */

const { gatherTitle, gatherRating, gatherPrice, gatherNumSold, gatherAge,
  gatherReview, gatherNumberRatings, gatherNumberImage, gatherOpenSinceDate } = require("../scripts/scanner");
const path = require("path");
const fs = require("fs")

describe('parsingTest', () => {

  const html = fs.readFileSync(path.resolve(__dirname, "localHTMLpage/SOYES XS19 Mini Smartphone 3.88in 2GB RAM 16GB ROM Android10.0 With Facial Recognition Dual SIM Standby 3G Network Small Phone.html"),"utf-8");

  test('parsing title correctly', () => {
    const html = fs.readFileSync(
      path.resolve(__dirname, "localHTMLpage/SOYES XS19 Mini Smartphone 3.88in 2GB RAM 16GB ROM Android10.0 With Facial Recognition Dual SIM Standby 3G Network Small Phone.html"),
      "utf-8"
    );

    document.documentElement.innerHTML = html;
    const title = gatherTitle();

    expect(title).toEqual("SOYES XS19 Mini Smartphone 3.88in 2GB RAM 16GB ROM Android10.0 With Facial Recognition Dual SIM Standby 3G Network Small Phone");
  })


  test('parsing rating correctly', () => {
    const html = fs.readFileSync(
      path.resolve(__dirname, "localHTMLpage/SOYES XS19 Mini Smartphone 3.88in 2GB RAM 16GB ROM Android10.0 With Facial Recognition Dual SIM Standby 3G Network Small Phone.html"),
      "utf-8"
    );

    document.documentElement.innerHTML = html;

    const rating = gatherRating();
    expect(rating).toEqual(4.4);   
  })

  test('parsing price correctly', () => {
    const html = fs.readFileSync(
      path.resolve(__dirname, "localHTMLpage/SOYES XS19 Mini Smartphone 3.88in 2GB RAM 16GB ROM Android10.0 With Facial Recognition Dual SIM Standby 3G Network Small Phone.html"),
      "utf-8"
    );

    document.documentElement.innerHTML = html;


    const price = gatherPrice();
    expect(price).toEqual(32.27);  
  })

  test('parsing numberSold correctly', () => {
    const html = fs.readFileSync(
      path.resolve(__dirname, "localHTMLpage/SOYES XS19 Mini Smartphone 3.88in 2GB RAM 16GB ROM Android10.0 With Facial Recognition Dual SIM Standby 3G Network Small Phone.html"),
      "utf-8"
    );

    document.documentElement.innerHTML = html;

    const numSold = gatherNumSold();
    expect(numSold).toEqual(800);
  })

  test('parsing reviews correctly', () => {
    const html = fs.readFileSync(
      path.resolve(__dirname, "localHTMLpage/SOYES XS19 Mini Smartphone 3.88in 2GB RAM 16GB ROM Android10.0 With Facial Recognition Dual SIM Standby 3G Network Small Phone.html"),
      "utf-8"
    );

    document.documentElement.innerHTML = html;
    const reviews = gatherReview();
    
    const reviewsTest = [
      "The product works well and sounds good; it has YouTube and Android 10.",
      "Thank you it’s my first time having a small smart phone now the only thing got to get is a sim card",
      "Smaller than expected however i was thinking just a little bit bigger nonetheless it's still a nice phone , take a sims call, i going to take it to boost or t mobile and see if they can help me out with a service plan or something.. Still a nice person for a reasonable price."
    ];
        
    for(let i = 0; i < reviewsTest.length; i++){
      expect(reviews[i]).toEqual(reviewsTest[i]);
    }
  })

});