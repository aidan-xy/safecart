# SafeCart Browser Extension Dev Guide

## Repository Layout
- NOTE: This section can and likely will be changed and adjusted throughout development
- `safecart/` - Core extension source code
    - `frontend/` – UI injection, extension popup, badges, icons, popups
    - `model/` – Stores the trust score machine learning model
    - `scripts/` – Data gathering, hard-coded scoring algorithms, model inference, evaluation logic
    - `tests/` – Tests. Uses Jest for testing.
- `documentation/` – Developer guides, test plans, requirements, and meeting notes
- `weekly status reports/` – Team sprint updates
- `README.md` – Project overview and instructions
- `userguide.md` - User Guide

---

## Building and Testing
- Prerequisites: at least node.js: v22.13.0, npm: 10.9.2, python: 3.11, pip: 2.25.3
- Clone the repo `git clone https://github.com/aidan-xy/safecart.git` and `cd` into root directory
- Install dependencies `npm install` and `pip install -r requirements.txt`
- To train model, place data in `/safecart/model/data` then edit `trust_model_logistic_regression.py` to use it (line 21)
    - then run `python trust_model_logistic_regression.py ; python export_pipeline_onnx.py` **from the model directory** (do `cd safecart/model`)
- To run tests do `npm test`
- To build, run `npm run build`
- After building, go to `chrome://extensions` then load unpacked from `safecart/safecart`

### Adding new tests
 - Write your tests using Jest (https://jestjs.io/docs/getting-started) then place them in the tests folder (safecart/tests).
 - Name the test file <name>.test.js and it will automatically be run when the CI script is triggered or `npm run test` is used.
 - Refer to `documentation/tests.md` for more information


---

## Building a Release
 - Before, run `npm run build`
 - From root, `cd safecart`
 - Zip the entire contents of the folder into `safecart.zip`
 - Create a new release on Github, attaching the zip as a binary
