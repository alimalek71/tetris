# Tetris

A browser-based Tetris clone with offline support.

## Features
- Classic Tetris gameplay on HTML5 canvas.
- Achievements and daily challenge modes.
- Local leaderboard.
- Installable Progressive Web App (PWA) with offline caching.
- Basic analytics hooks.

## Development Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
   The app runs at http://localhost:3000.
3. Run tests:
   ```bash
   npm test
   ```
4. Build optimized static files:
   ```bash
   npm run build
   ```
   Output is generated in the `dist` directory.

## Contribution Guidelines
1. Fork the repository and create a branch for your change.
2. Install dependencies and ensure `npm test` and `npm run build` complete without errors.
3. Submit a pull request describing your changes.

## Deployment
The project is configured for GitHub Pages deployment via GitHub Actions. Pushes to `main` trigger a build and publish the contents of `dist` to the `gh-pages` environment.
