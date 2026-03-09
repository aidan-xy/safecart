/**
 * @jest-environment jsdom
 */

import {gatherTitle, 
        gatherRating, 
        gatherPrice, 
        gatherNumSold, 
        gatherReview, 
        gatherOpenSinceDate,
        gatherNumberImage,
        gatherNumberRatings,
        gatherAge,
        getAllInformationForAlg,
        computeAveragePrice, 
        gatherSearchedPrices,
        createURLForSearchPage,
        currPageType} from "../scripts/scanner";

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

const originalError  = console.error;

beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation((msg, ...args) => {
    if (typeof msg === 'string' && msg.includes('Could not parse CSS stylesheet')) return;
    originalError(msg, ...args); // let all other errors through normally
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

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

    const rating = gatherTitle(document);
    expect(rating).toEqual("40W 2 Ports USB-C Type-C GaN Fast Charger with Charging Light, Fast Charging Block with 3.3Ft Type-C Charging Cable For IPhone");   
  })

  test('seeing if it dectect the page correctly', () => {
    const pageType = currPageType(document);
    expect(pageType).toEqual("listing")
  })

  test('sending back the correct link', () => {
    const rating = createURLForSearchPage(document);
    expect(rating).toEqual("https://www.aliexpress.com/w/wholesale-40W-2-Ports-USB-C-Type-C-GaN-Fast-Charger-with-Cha.html");   
  })

  test('sending back the correct link', () => {
    const rating = createURLForSearchPage(document, "https://www.aliexpress.us/item/3256810119868316.html?spm=a2g0o.productlist.main.6.14b63cb23bjkOf&algo_pvid=fd01a302-8a5a-4a07-861d-e41e7c0fe29d&algo_exp_id=fd01a302-8a5a-4a07-861d-e41e7c0fe29d-5&pdp_ext_f=%7B%22order%22%3A%22184%22%2C%22eval%22%3A%221%22%2C%22fromPage%22%3A%22search%22%7D&pdp_npi=6%40dis%21USD%2116.80%210.99%21%21%21115.36%216.79%21%402103212317711971944063518ef621%2112000051873183901%21sea%21US%210%21ABX%211%210%21n_tag%3A-29910%3Bd%3Aacf72556%3Bm03_new_user%3A-29895%3BpisId%3A5000000201000927&curPageLogUid=UGx9dkDNIrCG&utparam-url=scene%3Asearch%7Cquery_from%3A%7Cx_object_id%3A1005010306183068%7C_p_origin_prod%3A");
    expect(rating).toEqual("https://www.aliexpress.us/w/wholesale-40W-2-Ports-USB-C-Type-C-GaN-Fast-Charger-with-Cha.html");   
  })

  test('parsing rating correctly', () => {

    const rating = gatherRating(document);
    expect(rating).toEqual(4.9);   
  })

  test('parsing number of ratings correctly', () => {
    const rating = gatherNumberRatings(document);
    expect(rating).toEqual(19);   
  })

  test('parsing price correctly', () => {
    const price = gatherPrice(document);
    expect(price).toEqual(0.99);  
  })

  test('parsing numberSold correctly', () => {

    const numSold = gatherNumSold(document);
    expect(numSold).toEqual(184);
  })

  test('parsing reviews correctly', () => {

    const reviews = gatherReview(document);
    
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
    const openSinceDate = gatherOpenSinceDate(document);

    expect(openSinceDate).toEqual("Sep 4, 2025")
  })
  test('parsing and calculating years old correctly', () => {
    const yearsOldTest = gatherAge(document);
    //calulating the current years old from current date
    const openSinceDateInDate = new Date(openSinceDate)
    const today = new Date()

    expect(yearsOldTest).toEqual(0.51)
  })
  test('parsing number of images correctly', () => {
    const numberOfImage = gatherNumberImage(document);

    expect(numberOfImage).toEqual(2)
  })

  test('putting together the information and send it to the AGI correctly', () => {
    const recordToSend = getAllInformationForAlg(document);

    const openSinceDateInDate = new Date(openSinceDate)
    const today = new Date()

    const expectedRecord = {productRating : 4.9,
                            listingPrice: 0.99, 
                            numSold: 184, 
                            ageYears: 0.51,
                            numRating: 19,
                            reviewImages: 2}
    expect(Object.keys(recordToSend).length).toEqual(Object.keys(expectedRecord).length)
     
    for (const key in expectedRecord) {
      expect(recordToSend[key]).toEqual(expectedRecord[key]);
    }
  })

  // test('sending back the correct request', () => {
  //   const recordToSend = getAllInformationForSimpleAIg();

  //   const openSinceDateInDate = new Date(openSinceDate)
  //   const today = new Date()
  //   let yearsOld = ((today.getTime() - openSinceDateInDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25))
  //   yearsOld = Math.round(yearsOld * 100)/100

  //   const expectedRecord = {productRating : 4.9, 
  //                           numSold: 184, 
  //                           ageYears: yearsOld,
  //                           numRating: 19,
  //                           reviewImages: 2}
  //   expect(Object.keys(recordToSend).length).toEqual(Object.keys(expectedRecord).length)
     
  //   for (key in expectedRecord) {
  //     expect(recordToSend[key]).toEqual(expectedRecord[key]);
  //   }


  // })
  

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

    const rating = gatherRating(document);
    expect(rating).toEqual(0);   
  })

  test('parsing number of ratings correctly', () => {
    const rating = gatherNumberRatings(document);
    expect(rating).toEqual(0);  
  })

  test('parsing price correctly', () => {
    const price = gatherPrice(document);
    expect(price).toEqual(5355.81);  
  })

  test('parsing numberSold correctly', () => {
    const numSold = gatherNumSold(document);
    expect(numSold).toEqual(0);
  })

  test('parsing reviews correctly', () => {
    const reviews = gatherReview(document);
    const reviewsTest = [];
    expect(reviews).toEqual(reviewsTest);
  })

  test('parsing open since date correctly', () => {
    const openSinceDate = gatherOpenSinceDate(document);
    expect(openSinceDate).toEqual("")
  })

  test('parsing and calculating years old correctly', () => {
    const yearsOldTest = gatherAge(document);

    expect(yearsOldTest).toEqual(0);
  })

  test('parsing number of images correctly', () => {
    const numberOfImage = gatherNumberImage(document);
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
    const rating = gatherTitle(document);
    expect(rating).toEqual("");   
  })

  test('sending back an error message', () => {
    const link = createURLForSearchPage()
    expect(link).toEqual("error: can't find the title");  
  })

  test('parsing rating correctly', () => {

    const rating = gatherRating(document);
    expect(rating).toEqual(0);   
  })

  test('parsing number of ratings correctly', () => {
    const rating = gatherNumberRatings(document);
    expect(rating).toEqual(0);  
  })

  test('parsing price correctly', () => {
    const price = gatherPrice(document);
    expect(price).toEqual(0);  
  })

  test('parsing numberSold correctly', () => {
    const numSold = gatherNumSold(document);
    expect(numSold).toEqual(0);
  })

  test('parsing open since date correctly', () => {
    const openSinceDate = gatherOpenSinceDate(document);
    expect(openSinceDate).toEqual("")
  })

  test('parsing and calculating years old correctly', () => {
    const yearsOldTest = gatherAge(document);
    expect(yearsOldTest).toEqual(0);
  })

  test('parsing number of images correctly', () => {
    const numberOfImage = gatherNumberImage(document);
    expect(numberOfImage).toEqual(0)
  })

});

describe('parsing search pages', () => {

  beforeEach(() => {
    const html = fs.readFileSync(path.resolve(__dirname, "localHTMLpage/Sand-AliExpress.html"),"utf-8");
    document.documentElement.innerHTML = html;
  });

  afterEach(() => {
    document.documentElement.innerHTML = '';
  });

  // test('getting the avg price correctly', () => {
  //   const avg = computeAveragePrice()
  //   expect(avg).toEqual(5.88);
  // })

  test('getting the number listing price correct', () => {
    const listingPrices = gatherSearchedPrices(document)
    const expectedListingPrice = [
      3.29, 5.49, 0.99, 2.94, 12.32, 
      6.7, 0.99, 0.99, 0.99, 0.99, 
      2.09, 13.99, 0.99, 1.88, 0.99, 
      8.17, 3.81, 0.99, 2.48, 0.99,
      0.99, 8.98, 8.28, 18.78, 20.68, 
      16.7, 0.99, 9.83, 0.99, 11.05, 
      17.92, 0.99
    ]
    if(listingPrices.length != expectedListingPrice.length) {
      expect(listingPrices.length).toEqual(expectedListingPrice.length);
    }
    expect(listingPrices).toEqual(expectedListingPrice)
  })

  test('seeing if it dectect the page correctly', () => {
    const pageType = currPageType();
    expect(pageType).toEqual("search")
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

  test('not in a listing or a search page', () => {
    const pageType = currPageType();
    expect(pageType).toEqual("unknown");
  })

  test('no title HTML', () => {
    const numberOfImage = gatherTitle(document);
    expect(numberOfImage).toEqual("no value yet")
  })

  test('no price HTML', () => {
    const numberOfImage = gatherPrice(document);
    expect(numberOfImage).toEqual(0)
  })

  test('default value of number of Image of something strange happend to the number of Image HTML', () => {
    document.documentElement.innerHTML = '<span class="comet-icon comet-icon-photo filter--labelIcon--O0LEQIg"><svg viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor" aria-hidden="false" focusable="false"><path d="M586.666667 405.333333a96 96 0 1 1 192 0 96 96 0 0 1-192 0z m96-32a32 32 0 1 0 0 64 32 32 0 0 0 0-64z"></path><path d="M896 800a10.666667 10.666667 0 0 0 10.666667-10.666667V234.666667a10.666667 10.666667 0 0 0-10.666667-10.666667H128a10.666667 10.666667 0 0 0-10.666667 10.666667v554.666666a10.666667 10.666667 0 0 0 10.666667 10.666667h768z m74.666667-10.666667a74.666667 74.666667 0 0 1-74.666667 74.666667H128A74.666667 74.666667 0 0 1 53.333333 789.333333V234.666667A74.666667 74.666667 0 0 1 128 160h768a74.666667 74.666667 0 0 1 74.666667 74.666667v554.666666z"></path><path d="M373.909333 467.584a64 64 0 0 0-87.466666-2.197333l-201.066667 179.157333a32 32 0 1 0 42.581333 47.786667l201.045334-179.157334 178.496 175.850667a64 64 0 0 0 89.834666 0l59.882667-59.008 242.133333 164.458667a32 32 0 1 0 35.968-52.949334l-242.133333-164.437333a64 64 0 0 0-80.874667 7.338667l-59.882666 59.008-178.496-175.850667z"></path></svg></span>';
    const numberOfImage = gatherNumberImage(document);
    expect(numberOfImage).toEqual(0);
  })

  test('test gatherAge to see if there is a website but there is no price element', () => {
    const htmlString = fs.readFileSync(path.resolve(__dirname, "localHTMLpage/SUMRY 4KW 6KW 120V Off Grid Solar Inverter 24V 140A 5600W MPPT Charger Pure Sine Wave Home Inverter 6.25 Inch LCD Display.html"),"utf-8");
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(htmlString, 'text/html');
    const price = gatherPrice(htmlDoc);
    expect(price).toEqual(0);
  })

});

test("testing what happend if we cannot get any info from listing", ()=> {
  const html = fs.readFileSync(path.resolve(__dirname, "localHTMLpage/china - Buy china with free shipping on AliExpress.html"),"utf-8");
  document.documentElement.innerHTML = html;

  const avgPrice = computeAveragePrice();
  expect(avgPrice).toEqual(-1);
})

test("testing if the title is between 50 alphabet", () => {
  const html = fs.readFileSync(path.resolve(__dirname,"localHTMLpage/14K Dainty Gold Bow Necklace for Women Mom Teen Girls, Cute Small Tiny Bow Pendant Choker Chain Necklaces Jewelry Gifts for Her - AliExpress.html"),"utf-8");
  document.documentElement.innerHTML = html;

  const link = createURLForSearchPage();
  expect(link).toEqual("https://www.aliexpress.com/w/wholesale--14K-Dainty-Gold-Bow-Necklace-for-Women-Mom-Teen.html")
})


test("testing if the getting the price from a search exclude the free", () => {
  //this page have a listing that changes one of the aria label in to arial label
  const html = fs.readFileSync(path.resolve(__dirname,"localHTMLpage/Paper-AliExpress.html"),"utf-8");
  document.documentElement.innerHTML = html;

  const prices = gatherSearchedPrices(document);
  const expectedPrices = [
    9.15, 4.38, 0.99,
    0.99, 0.83, 0.99
  ]
  expect(prices).toEqual(expectedPrices);
}) 


describe('testing for the dollar express page', () => { 

  beforeEach(() => {
    const html = fs.readFileSync(path.resolve(__dirname, "localHTMLpage/Bundle Deals 2.0.html"),"utf-8");
    document.documentElement.innerHTML = html;
  });

  afterEach(() => {
    document.documentElement.innerHTML = '';
  });

  test("check if it correctly dectect the type of page", () => {
    const expectedPageType = currPageType();
    expect(expectedPageType).toEqual("for you");
  })

  test('parsing numSold', () => {
    const NumSold = gatherNumSold(document);
    expect(NumSold).toEqual(10000);
  })

  test('test gatherNumberRatings when can\'t dectect website ', () => {
    const NumberRatings = gatherNumberRatings(document);
    expect(NumberRatings).toEqual(1696);
  })

  test('test gatherOpenSinceDate when can\'t dectect website', () => {
    const OpenSinceDate = gatherOpenSinceDate(document);
    expect(OpenSinceDate).toEqual("Dec 11, 2022");
  })

  // test('test gatherAge when can\'t dectect website', () => {
  //   const Age = gatherAge();
  //   expect(Age).toEqual(0);
  // })

  test('parsing the age', () => {
    const rating = gatherRating(document);
    expect(rating).toEqual(4.7);
  })

  test('parsing the title', () => {
    const title = gatherTitle(document);
    expect(title).toEqual("45000RPM Rechargeable Electric Nail Drill Machine Professional Nail Drills for Gel Nails Polish Portable Nail File Manicure Tool");
  })


})