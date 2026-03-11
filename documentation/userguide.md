# User Guide

SafeCart is a browser extension for Google Chrome that assists in determining the trustworthiness of online marketplace listings at a glance. Currently, this extension only functions on [AliExpress](https://www.aliexpress.us/).

## Installation

1. Download the `safecart.zip` file from the latest [release](https://github.com/aidan-xy/safecart/releases) and unzip it anywhere on your computer (for example, your Downloads or Desktop folder).<br>
**Important**: Do not delete the contents of this file after installing, or the extension will stop working. We recommend you unzip in a separate folder/directory on your device. <br>

![Image failed to load](userguideImages/intsall_1_edit.png)

2. Navigate to [chrome://extensions](chrome://extensions/) and enable developer mode in the top right.

3. Click the `Load Unpacked` button.
  
4. Select the directory containing the unzipped contents to load the extension.

## Using SafeCart
Note that SafeCart only functions on Google Chrome and AliExpress. It also may not function properly on Brand+ or other abnormal listings.
### On a Product Page

1. Navigate to a product listing page of AliExpress (with "item" in the url) for example: `https://www.aliexpress.us/item/3256806256696105.html`.

2. Click the extension icon in the toolbar of your browser.

3. The listing's trust score is given in the popup window of the extension.

4. Additional information can be seen by expanding the dropdown menu.

### On a Search Page

1. Search for a product on AliExpress.

2. Click the button (blue circle with white "S") on any listing.

3. The product's trust score can be seen in the popup by the button.

## Bug Reporting

If you encounter a bug or inconvenience while using SafeCart, create an issue on the [GitHub](https://github.com/aidan-xy/safecart/issues). In the body of the issue, give information about it using the following template:

```
Chrome Version: 
*Give the version of Chrome used (found at chrome://version at the very top)*

Webpage: 
*Give the webpage where the bug occured, or N/A if needed* 

Recreation Steps: 
*Describe the steps that led to said bug/inconvenience in a numbered list. Give enough information that someone who hasn't used the extension could follow to reproduce the bug*
```

## Known Bugs
- Seller age will not be parsed if the element containing the seller's start date has not been loaded yet. As a workaround, make sure to load that element by hovering over the seller's nameplate in the listing.


