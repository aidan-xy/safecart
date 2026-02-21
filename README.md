# SafeCart Browser Extension

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
- `safecart/` – Core extension source code
    - `frontend/` – UI injection, extension popup, badges, icons, popups
    - `backend/` – Stores the trust score machine learning model
    - `scripts/` – Data gathering, hard-codeed scoring algorithms, evaluation logic
    - `tests/` – Tests. Uses Jest for testing.
- `documentation/` – Developer guides, test plans, requirements, and meeting notes
- `weekly status reports/` – Team sprint updates
- `README.md` – Project overview and instructions

---

## Building and Testing
- Prerequisite: have node.js and npm installed
- Clone the repo `git clone https://github.com/aidan-xy/safecart.git`
- Install dependencies `npm install`
- To run tests do `npm test`
- To build, run `npm run build`
- After building, go to `chrome://extensions` then load unpacked from `safecart/safecart`

---

## Living Document
Our detailed development plan, including team structure, use cases, feature priorities, software architecture, and testing strategy, is available here: [Living Document](https://docs.google.com/document/d/1RP_SkYVXHQKIgePIt1XsPocgwo44w8h7hUF4WwmrRl4/edit?usp=sharing)

---

## Release Tags
Beta Release: `beta`