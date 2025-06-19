# Chess

This project uses TypeScript. The compiled files are output to the `dist/` folder.

## Setup

Install dependencies:

```bash
npm install
```

## Build

Compile the TypeScript sources into `dist/`:

```bash
npm run build
```

## GitHub Pages

GitHub Pages is deployed automatically using a workflow in `.github/workflows/pages.yml`. On every push to `main`, the action builds the project and publishes the `dist/` folder.
