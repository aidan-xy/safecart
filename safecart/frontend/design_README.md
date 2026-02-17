# SafeCart Frontend

This folder contains the UI code for the SafeCart browser extension popup.  
It is responsible for rendering the trust score, detailed trust metrics, and all associated styling and visual components shown when a user clicks the SafeCart extension icon.

---

## Folder Structure

frontend/
└── popup/
    ├── App.tsx
    ├── Attributions.md
    ├── globals.css
    └── components/
        ├── TrustMetrics.tsx
        └── TrustScore.tsx

---

## popup/

Contains all UI-related code for the SafeCart popup interface.

### App.tsx

- Root React component for the popup UI.
- Renders the overall trust score for the current product listing.
- Allows users to toggle a detailed breakdown of trust metrics.
- Manages layout and high-level state for the popup window.

---

### Attributions.md

- Documents third-party design assets used in the popup UI.
- Includes:
  - shadcn/ui components (MIT License)
  - Unsplash images used under their respective licenses

---

### globals.css

- Initializes Tailwind CSS for the SafeCart popup UI.
- Defines shared global styles.
- Includes a custom `fadeIn` animation used to smoothly animate elements (such as the trust metrics panel) into view.

---

## popup/components/

Contains reusable UI components used within the popup.

---

### TrustScore.tsx

- Renders the main circular trust score indicator.
- Displays:
  - Percentage score
  - Animated progress ring
  - Color-coded trust level badge based on score range
- Serves as the primary visual trust indicator in the popup.

---

### TrustMetrics.tsx

- Renders the detailed trust breakdown section.
- Displays each trust metric with:
  - Color-coded status icon
  - Percentage score
  - Progress bar
- Uses predefined score thresholds to determine visual state.

---

## Summary

The `frontend` directory is focused exclusively on rendering and styling the SafeCart popup UI.  
It does not contain backend logic or trust-scoring computation — it visualizes trust data provided by other parts of the SafeCart system.


Note for future figma-related edits:
If editing access is needed, contact design owners: Chandana or Dylan
