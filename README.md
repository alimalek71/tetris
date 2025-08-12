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
