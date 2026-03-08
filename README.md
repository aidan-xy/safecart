# SafeCart Browser Extension

For the developer guide, visit `documentation/devguide.md`

For the user guide, visit `documentation/userguide.md`

## Project Idea and Goals
SafeCart is a browser extension designed to help users safely navigate online marketplaces (currently focused on AliExpress). It analyzes publicly available data about listings and sellers to provide a **trustworthiness rating**, helping users avoid scams or low-quality products.

**Goals:**
- Automatically evaluate listings and flag suspicious vendors. (Complete)
- Provide a clear, interpretable trust score per listing. (Complete)
- Display trust metrics on both search results and individual listing pages.
- Lay the foundation for machine learning-based evaluations in the future.

**Current Functional Use Cases and Features:**
- Can evaluate any Aliexpress listing for trustworthiness. Display's trust score/metrics to user in extension popup window.

---

## Repository Layout
- NOTE: This section can and likely will be changed and adjusted throughout development
- `safecart/` - Core extension source code
    - `frontend/` – UI injection, extension popup, badges, icons, popups
    - `model/` – Stores the trust score machine learning model
    - `scripts/` – Data gathering, hard-coded scoring algorithms, model inference, evaluation logic
    - `tests/` – Tests. Uses Jest for testing.
- `documentation/` – User guide, Developer guide, test plans, and requirements
- `weekly status reports/` – Team sprint updates
- `README.md` – Project overview, layout, and instructions

---

## Building and Testing
- Prerequisites: at least node.js: v22.13.0, npm: 10.9.2, python: 3.11, pip: 2.25.3
- Clone the repo `git clone https://github.com/aidan-xy/safecart.git`
- Install dependencies `npm install` and `pip install -r requirements.txt`
- To train model, place data in `/safecart/model/data` then edit `trust_model_logisitc_regression.py` to use it (line 21) then run both that file and `export_pipeline_onnx.py` in `/safecart/model`
- To run tests do `npm test`
- To build, run `npm run build`
- After building, go to `chrome://extensions` then load unpacked from `safecart/safecart`

### Adding new tests
 - Write your tests using Jest (https://jestjs.io/docs) then place them in the tests folder (safecart/tests).
 - Name the test file <name>.test.js and it will automatically be run when the CI script is triggered or `npm run test` is used.
 - Refer to `documentation/tests.md` for more information


---

## Living Document
Our detailed development plan, including team structure, use cases, feature priorities, software architecture, and testing strategy, is available here: [Living Document](https://docs.google.com/document/d/1RP_SkYVXHQKIgePIt1XsPocgwo44w8h7hUF4WwmrRl4/edit?usp=sharing)

---

## Release Tags

Beta Release: `beta`

Gamma Release: `gamma`
