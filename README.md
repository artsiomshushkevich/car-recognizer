# Vroom Room

A playful, offline friendly car-brand flash-card app built with Vite, React, and Tailwind CSS. Swipe, use the on-screen arrows, or press the left and right arrow keys to browse a shuffled deck of 100 car brand SVGs.

## Run locally

```sh
npm install
npm run dev
```

Create the production build with `npm run build`; use `npm run preview` to serve it locally and verify the PWA service worker.

## Logo assets

The SVG logos came from the local `brand-logos` collection and are copied into `public/logos/` so they are included in the offline precache. Brand names and logo rights belong to their respective owners. The collection’s README and MIT license are available with the source collection.

See [TEST_REPORT.md](./TEST_REPORT.md) for Chrome MCP test results.
