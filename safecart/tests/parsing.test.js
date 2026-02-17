/**
 * @jest-environment jsdom
 */

global.chrome = {
  runtime: {
    sendMessage: jest.fn(),
    onMessage: {
      addListener: jest.fn()
    }
  },
  tabs: {
    query: jest.fn(),
    sendMessage: jest.fn()
  },
  storage: {
    local: {
      get: jest.fn(),
      set: jest.fn()
    }
  }
};

const {gatherTitle, 
        gatherRating, 
        gatherPrice, 
        gatherNumSold, 
        gatherReview, 
        gatherOpenSinceDate,
        gatherNumberImage,
        gatherNumberRatings,
        gatherAge,
        getAllInformationForSimpleAGI} = require("../scripts/scanner");
const path = require("path");
const fs = require("fs")

describe('parsingTest on a page with all the information needed', () => {

  beforeEach(() => {
    const html = fs.readFileSync(path.resolve(__dirname, "localHTMLpage/40W 2 Ports USB-C Type-C GaN Fast Charger with Charging Light, Fast Charging Block with 3.3Ft Type-C Charging Cable For IPhone - AliExpress.html"),"utf-8");
    document.documentElement.innerHTML = html;
  });

  afterEach(() => {
    document.documentElement.innerHTML = '';
  });


  test('parsing title correctly', () => {

    const rating = gatherTitle();
    expect(rating).toEqual("40W 2 Ports USB-C Type-C GaN Fast Charger with Charging Light, Fast Charging Block with 3.3Ft Type-C Charging Cable For IPhone");   
  })

  test('parsing rating correctly', () => {

    const rating = gatherRating();
    expect(rating).toEqual(4.9);   
  })

  test('parsing number of ratings correctly', () => {
    const rating = gatherNumberRatings();
    expect(rating).toEqual(19);   
  })

  test('parsing price correctly', () => {
    const price = gatherPrice();
    expect(price).toEqual(0.99);  
  })

  test('parsing numberSold correctly', () => {

    const numSold = gatherNumSold();
    expect(numSold).toEqual(184);
  })

  test('parsing reviews correctly', () => {

    const reviews = gatherReview();
    
    const reviewsTest = [
      "Charger my phone quickly, as described.",
      "Pretty good product. Recommended",
      "Works well"
    ];
        
    for(let i = 0; i < reviewsTest.length; i++){
      expect(reviews[i]).toEqual(reviewsTest[i]);
    }
  })
  let openSinceDate;
  test('parsing open since date correctly', () => {
    openSinceDate = gatherOpenSinceDate();

    expect(openSinceDate).toEqual("Sep 4, 2025")
  })
  test('parsing and calculating years old correctly', () => {
    yearsOldTest = gatherAge();
    //calulating the current years old from current date
    const openSinceDateInDate = new Date(openSinceDate)
    const today = new Date()
    let yearsOld = ((today.getTime() - openSinceDateInDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25))
    yearsOld = Math.round(yearsOld * 100)/100

    expect(yearsOldTest).toEqual(yearsOld)
  })
  test('parsing number of images correctly', () => {
    const numberOfImage = gatherNumberImage();

    expect(numberOfImage).toEqual(2)
  })

  test('putting togther the information and send it to the AGI correctly', () => {
    const recordToSend = getAllInformationForSimpleAGI();

    const openSinceDateInDate = new Date(openSinceDate)
    const today = new Date()
    let yearsOld = ((today.getTime() - openSinceDateInDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25))
    yearsOld = Math.round(yearsOld * 100)/100

    const expectedRecord = {productRating : 4.9, 
                            numSold: 184, 
                            ageYears: yearsOld,
                            numRating: 19,
                            reviewImages: 2}
    expect(Object.keys(recordToSend).length).toEqual(Object.keys(expectedRecord).length)
     
    for (key in expectedRecord) {
      expect(recordToSend[key]).toEqual(expectedRecord[key]);
    }


  })

  test('if it sends the correct data', () => {

    const openSinceDateInDate = new Date(openSinceDate)
    const today = new Date()
    let yearsOld = ((today.getTime() - openSinceDateInDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25))
    yearsOld = Math.round(yearsOld * 100)/100

    const mockRequest = { action: "getData" };
    const mockSender = {};
    const mockSendResponse = jest.fn();
    
    const expectedRecord = {productRating : 4.9, 
                            numSold: 184, 
                            ageYears: yearsOld,
                            numRating: 19,
                            reviewImages: 2}

    const listener = chrome.runtime.onMessage.addListener.mock.calls[0][0];

    listener(mockRequest, mockSender, mockSendResponse);

    expect(mockSendResponse).toHaveBeenCalledWith(expectedRecord);
  })

  test('testing to if it respond to the rong action', (done) => {

    const openSinceDateInDate = new Date(openSinceDate)
    const today = new Date()
    let yearsOld = ((today.getTime() - openSinceDateInDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25))
    yearsOld = Math.round(yearsOld * 100)/100

    const mockRequest = { action: "getDatas" };
    const mockSender = {};
    const mockSendResponse = jest.fn();

    const listener = chrome.runtime.onMessage.addListener.mock.calls[0][0];

    listener(mockRequest, mockSender, mockSendResponse);

    expect(mockSendResponse).not.toHaveBeenCalled();
    done()
  })
  

});

describe('parsing a page with some information missing', () => {

  beforeEach(() => {
    const html = fs.readFileSync(path.resolve(__dirname, "localHTMLpage/MMS 1.5Ton Mini Excavator 13.5HP B&S Engine Trencher Digger Pilot Control Crawler Digger for Farm Garden Yard Full Payment - AliExpress.html"),"utf-8");
    document.documentElement.innerHTML = html;
  });

  afterEach(() => {
    document.documentElement.innerHTML = '';
  });


  test('parsing rating correctly', () => {

    const rating = gatherRating();
    expect(rating).toEqual(0);   
  })

  test('parsing number of ratings correctly', () => {
    const rating = gatherNumberRatings();
    expect(rating).toEqual(0);  
  })

  test('parsing price correctly', () => {
    const price = gatherPrice();
    expect(price).toEqual(5355.81);  
  })

  test('parsing numberSold correctly', () => {
    const numSold = gatherNumSold();
    expect(numSold).toEqual(0);
  })

  test('parsing reviews correctly', () => {
    const reviews = gatherReview();
    const reviewsTest = [];
    expect(reviews).toEqual(reviewsTest);
  })

  test('parsing open since date correctly', () => {
    openSinceDate = gatherOpenSinceDate();
    expect(openSinceDate).toEqual("")
  })

  test('parsing and calculating years old correctly', () => {
    yearsOldTest = gatherAge();

    expect(yearsOldTest).toEqual(0);
  })

  test('parsing number of images correctly', () => {
    const numberOfImage = gatherNumberImage();
    expect(numberOfImage).toEqual(0)
  })
});

describe('parsing a page that does have the html element but doesn\'t have the text inside', () => {

  beforeEach(() => {
    const html = fs.readFileSync(path.resolve(__dirname, "localHTMLpage/3256807811584970.html"),"utf-8");
    document.documentElement.innerHTML = html;
  });

  afterEach(() => {
    document.documentElement.innerHTML = '';
  });

  test('parsing title correctly', () => {
    const rating = gatherTitle();
    expect(rating).toEqual("");   
  })

  test('parsing rating correctly', () => {

    const rating = gatherRating();
    expect(rating).toEqual(0);   
  })

  test('parsing number of ratings correctly', () => {
    const rating = gatherNumberRatings();
    expect(rating).toEqual(0);  
  })

  test('parsing price correctly', () => {
    const price = gatherPrice();
    expect(price).toEqual(0);  
  })

  test('parsing numberSold correctly', () => {
    const numSold = gatherNumSold();
    expect(numSold).toEqual(0);
  })

  test('parsing open since date correctly', () => {
    openSinceDate = gatherOpenSinceDate();
    expect(openSinceDate).toEqual("")
  })

  test('parsing and calculating years old correctly', () => {
    yearsOldTest = gatherAge();
    expect(yearsOldTest).toEqual(0);
  })

  test('parsing number of images correctly', () => {
    const numberOfImage = gatherNumberImage();
    expect(numberOfImage).toEqual(0)
  })

});

describe('parsing edge cases', () => {

  beforeEach(() => {
    const html = fs.readFileSync(path.resolve(__dirname, "localHTMLpage/357g Chinese Yunnanpuer tea Cotton Paper Packaging Paper Shu pu er pu erh tissue Paper Teawarebag Reusable - AliExpress.html"),"utf-8");
    document.documentElement.innerHTML = html;
  });

  afterEach(() => {
    document.documentElement.innerHTML = '';
  });

  test('no title HTML', () => {
    const numberOfImage = gatherTitle();
    expect(numberOfImage).toEqual("no value yet")
  })

  test('no price HTML', () => {
    const numberOfImage = gatherPrice();
    expect(numberOfImage).toEqual(0)
  })

  test('default value of number of Image of something strange happend to the number of Image HTML', () => {
    document.documentElement.innerHTML = '<span class="comet-icon comet-icon-photo filter--labelIcon--O0LEQIg"><svg viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor" aria-hidden="false" focusable="false"><path d="M586.666667 405.333333a96 96 0 1 1 192 0 96 96 0 0 1-192 0z m96-32a32 32 0 1 0 0 64 32 32 0 0 0 0-64z"></path><path d="M896 800a10.666667 10.666667 0 0 0 10.666667-10.666667V234.666667a10.666667 10.666667 0 0 0-10.666667-10.666667H128a10.666667 10.666667 0 0 0-10.666667 10.666667v554.666666a10.666667 10.666667 0 0 0 10.666667 10.666667h768z m74.666667-10.666667a74.666667 74.666667 0 0 1-74.666667 74.666667H128A74.666667 74.666667 0 0 1 53.333333 789.333333V234.666667A74.666667 74.666667 0 0 1 128 160h768a74.666667 74.666667 0 0 1 74.666667 74.666667v554.666666z"></path><path d="M373.909333 467.584a64 64 0 0 0-87.466666-2.197333l-201.066667 179.157333a32 32 0 1 0 42.581333 47.786667l201.045334-179.157334 178.496 175.850667a64 64 0 0 0 89.834666 0l59.882667-59.008 242.133333 164.458667a32 32 0 1 0 35.968-52.949334l-242.133333-164.437333a64 64 0 0 0-80.874667 7.338667l-59.882666 59.008-178.496-175.850667z"></path></svg></span>';
    const numberOfImage = gatherNumberImage();
    expect(numberOfImage).toEqual(0);
  })

});