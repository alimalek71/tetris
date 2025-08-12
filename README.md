# tetris

A Simple Tetris Game

## Development

1. Install dependencies (none currently but sets up scripts):
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
   The site will be available at http://localhost:3000.

## Build

Build the static files to the `dist` directory:
```bash
npm run build
```

## Deployment

This project is configured to deploy to GitHub Pages using GitHub Actions. On every push to `main`, the site is built and published to the `gh-pages` environment.

## Analytics

Basic analytics hooks are available through `src/js/analytics.js`. The `track(eventName, data)` function logs game events such as game start, game over, line clear, and level up.

To use a real analytics provider:

1. Create a `src/js/config.js` file (ignored by Git) exporting your tracking key:

   ```js
   export const TRACKING_KEY = 'your-key-here';
   ```

2. Replace the `console.log` in `src/js/analytics.js` with calls to your analytics service (e.g., Google Analytics, Mixpanel).

By default, a dummy key is used and events are simply logged to the console.
