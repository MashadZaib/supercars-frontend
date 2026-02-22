# frontend-carizo

This project is a production-ready Vite + React conversion of the provided design, implemented using Tailwind CSS and following clean code practices.

What I implemented
- Vite + React skeleton with Tailwind CSS integration.
- Componentized layout under `src/components/` (Header, StepsPanel, Dashboard, StepForm, Register).
- `src/data/steps.js` contains the original steps data copied from your `script.js`.
- `src/hooks/useLocalStorage.js` provides a small hook to persist session data to localStorage (non-critical persistence — safe and optional).
- Tailwind configuration and PostCSS setup (`tailwind.config.cjs`, `postcss.config.cjs`).

Key choices & rationale
- Tailwind CSS: keeps styles consistent and makes responsive adjustments straightforward using utility classes.
- Component composition: each major area (dashboard, steps list, form, register) is a small reusable component for clarity and maintainability.
- useLocalStorage hook: preserves user work across refreshes (non-destructive). This helps test the UI without a backend.
- Accessibility: inputs have labels or aria-labels; dynamic content respects ARIA patterns where sensible.

How to run locally

1. Install dependencies (you already ran this on the workspace, but here are the commands):

```bash
cd frontend-carizo
npm install
```

2. Start dev server:

```bash
npm run dev
```

You should then open the printed localhost URL in your browser.

Notes and next steps
- The app is in-memory aside from localStorage; if you need persistent storage, I can wire a lightweight API or save to a file/backend.
- I can also split out the components further, add unit tests, TypeScript typing, and CI scripts if you'd like.

If you want me to start the dev server here and validate the UI, tell me and I'll run it and report back with the URL and any fixes.
