# Tetris

A simple Tetris game with offline support and progressive web app (PWA) features.

## Features

- Classic gameplay rendered on a responsive canvas
- Achievements panel and daily challenge mode
- Local leaderboard stored in the browser
- Installable PWA with offline caching via a service worker
- Analytics hooks ready for integration

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
   The game is available at [http://localhost:3000](http://localhost:3000).
3. Build optimized assets (bundled and minified `main.js` and `main.css`):
   ```bash
   npm run build
   ```
4. (Optional) Compress sound effects if present:
   ```bash
   npm run compress:sounds
   ```

## Contribution Guidelines

- Fork the repository and create a feature branch for your changes.
- Run `npm test` and `npm run build` before committing.
- Submit a pull request with a clear description of your changes.

## Deployment

The project can be served via any static host, including GitHub Pages. Ensure `index.html`, `main.js`, `main.css`, `manifest.json`, and `service-worker.js` are deployed at the site root so the service worker can cache assets for offline play.
