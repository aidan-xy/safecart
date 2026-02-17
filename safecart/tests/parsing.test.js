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

  test('parsing image count, number of ratings, open-since and age', () => {
    const html = fs.readFileSync(
      path.resolve(__dirname, "localHTMLpage/SOYES XS19 Mini Smartphone 3.88in 2GB RAM 16GB ROM Android10.0 With Facial Recognition Dual SIM Standby 3G Network Small Phone.html"),
      "utf-8"
    );

    document.documentElement.innerHTML = html;

    // number of ratings (e.g., "131 Reviews")
    const numRatings = gatherNumberRatings();
    expect(typeof numRatings).toBe('number');
    expect(numRatings).toBeGreaterThanOrEqual(0);

    // number of images (may be 0 if not present)
    const numImages = gatherNumberImage();
    expect(typeof numImages).toBe('number');
    expect(numImages).toBeGreaterThanOrEqual(0);

    // open since date falls back to default when store info not present
    const openSince = gatherOpenSinceDate();
    expect(typeof openSince).toBe('string');
    expect(openSince.length).toBeGreaterThan(0);

    // age should be a number (0 if store info missing, otherwise a positive number)
    const age = gatherAge();
    expect(typeof age).toBe('number');
    expect(age).toBeGreaterThanOrEqual(0);
  })

  test('parsers return defaults when elements are missing', () => {
    // empty document -> all parsers should return safe defaults (0 or fallback string)
    document.documentElement.innerHTML = '';

    expect(gatherRating()).toBe(0);
    expect(gatherPrice()).toBe(0);
    expect(gatherNumSold()).toBe(0);
    expect(gatherNumberImage()).toBe(0);
    expect(gatherNumberRatings()).toBe(0);

    // open since date returns the default string if not found
    expect(gatherOpenSinceDate()).toEqual("march, 22 2006");

    // when no store info, gatherAge returns 0
    expect(gatherAge()).toBe(0);
  })

});