# vue-movies-api
[![Node.js CI](https://github.com/Luigi-DV/vue-movies-api/actions/workflows/build.yml/badge.svg)](https://github.com/Luigi-DV/vue-movies-api/actions/workflows/build.yml)

The Vue Movies API is a SPA that consumes TMDb API


## Project Setup

```sh
npm install
```

### Environment Variables

Copy the example file and add your own [TMDb API key](https://www.themoviedb.org/settings/api):

```sh
cp .env.example .env
```

The key is never bundled into the client. The app calls `/api/tmdb/*`, and the key is appended server-side:
- **Development:** by the Vite dev server proxy (`vite.config.js`)
- **Production:** by the Vercel serverless function in `api/tmdb.js`. Set `TMDB_API_KEY` in your Vercel project's environment variables.

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
npm run build
npm run test:e2e # or `npm run test:e2e:ci` for headless testing
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
