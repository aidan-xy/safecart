# SafeCart Browser Extension

For the developer guide, visit `documentation/devguide.md`

For the user guide, visit `documentation/userguide.md`

## The Project
SafeCart is a browser extension designed to help users safely navigate online marketplaces (currently focused on AliExpress). It analyzes publicly available data about listings and sellers to provide a **trustworthiness rating**, helping users avoid scams or low-quality products.

---

## Current Features:
- Can evaluate an Aliexpress listing for trustworthiness. Display's trust score/metrics to user in extension popup window.
- From a search page, a button will display to allow the user to see the trust score directly from the search page.
- A machine learning algorithm is used to calculate trust scores.
- An item's price is compared to the average price of similar items in determining a trust score.
- 

---

## Repository Layout
- NOTE: This section can and likely will be changed and adjusted throughout development
- `safecart/` - Core extension source code.
    - `frontend/` – UI injection, extension popup, badges, icons.
    - `model/` – Stores the trust score machine learning model.
    - `images/` – The extension icons.
    - `scripts/` – Data gathering, hard-coded scoring algorithms, model inference, evaluation logic.
    - `tests/` – Tests. Uses Jest for testing.
- `documentation/` – User guide, Developer guide, test plans, and requirements.
- `weekly status reports/` – Team sprint updates.
- `README.md` – Project overview, layout, and instructions.

---

## Building and Testing
- Prerequisites: at least node.js: v22.13.0, npm: 10.9.2, python: 3.11, pip: 2.25.3
- Clone the repo `git clone https://github.com/aidan-xy/safecart.git`
- Install dependencies `npm install` and `pip install -r requirements.txt`
- To train model, place data in `/safecart/model/data` then edit `trust_model_logistic_regression.py` to use it (line 21)
    - then run `python trust_model_logistic_regression.py ; python export_pipeline_onnx.py` **from the model directory** (do `cd safecart/model`)
- To run tests, do `npm test`
- To build, do `npm run build`
- After building, go to `chrome://extensions` then load unpacked from `safecart/safecart`

### Adding new tests
 - Write your tests using Jest ([https://jestjs.io/docs/getting-started](https://jestjs.io/docs/getting-started)) then place them in the tests folder (safecart/tests).
 - Name the test file <name>.test.js and it will automatically be run when the CI script is triggered or `npm run test` is used.
 - Refer to `documentation/tests.md` for more information


---

## Living Document
Our detailed development plan, including team structure, use cases, feature priorities, software architecture, and testing strategy, is available here: [Living Document](https://docs.google.com/document/d/1RP_SkYVXHQKIgePIt1XsPocgwo44w8h7hUF4WwmrRl4/edit?usp=sharing)

---

## Use of AI in Development
As per the course policy, we utilized AI to help complete code based on our design and architecture. Our team consistenly met during daily standups to discuss our ideas for design and implementation before launching a hybrid AI-human development cycle for sprints. After outlining ideas and design choices, we used a combination of AI build tools to prototype relevant code files. Following the initial generaltion, we maintianed strong engineering principles by manually checking generated code to assess compatability and conducting code reviews on commits before merging to the main branch. Agentic coding was central to code completion and helping to implement our design choices, but all build ideas and rationale was our own.

---

## Release Tags

Beta Release: `beta`

Gamma Release: `gamma`

Final Release: `final`
