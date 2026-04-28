# Agents Guide

This is a RoxyAPI starter app. A tarot reading app built with React Native, Expo SDK 54, and TypeScript. Ships with the full 78 card Rider Waite deck, daily readings, multi card spreads, and yes or no divination, all powered by the RoxyAPI Tarot API.

## Setup
- Get an API key at https://roxyapi.com/pricing
- Create `.env` in the project root with:
  - `EXPO_PUBLIC_ROXYAPI_KEY=your_api_key_here`
  - `EXPO_PUBLIC_ROXYAPI_BASE_URL=https://roxyapi.com/api/v2`
- Install with `npm install`
- Run with `npm start`, then `npm run ios`, `npm run android`, or `npm run web`
- Optional: `npm run generate:types` to regenerate TypeScript types from the live OpenAPI spec

## How to call RoxyAPI
- Base URL: `https://roxyapi.com/api/v2`
- Auth header: `X-API-Key: <key>`
- Live OpenAPI spec: https://roxyapi.com/api/v2/tarot/openapi.json
- Live playground: https://roxyapi.com/api-reference

## Endpoints used in this app
- `GET /tarot/cards` for the full 78 card deck with images and meanings
- `GET /tarot/cards/{id}` for detailed upright and reversed meanings for a single card
- `GET /tarot/daily` for a seeded daily card with consistent results per user
- `GET /tarot/draw` for random single or multi card draws
- `GET /tarot/spreads/three-card` for past, present, future readings
- `GET /tarot/spreads/celtic-cross` for the 10 card Celtic Cross
- `GET /tarot/yes-no` for yes or no divination with confidence levels

## Where to extend
- `src/api/client.ts` is the API client setup with rate limit aware Axios.
- `src/api/tarot.ts` exports the tarot methods used by screens.
- `src/api/schema.ts` holds auto generated types from the OpenAPI spec.
- `app/(tabs)/` holds the tab screens: `index.tsx` (daily), `browse.tsx`, `draw.tsx`, `spreads.tsx`, `yes-no.tsx`.

## Conventions
- All RoxyAPI calls go through `src/api/`. Do not call `fetch` or `axios` directly from screens.
- Daily card seeding uses a stable user id from `AsyncStorage` so the daily card stays consistent across sessions.
- Respect `X-RateLimit-Remaining` and `X-RateLimit-Reset` response headers for graceful backoff.

## Resources
- TypeScript SDK: https://github.com/RoxyAPI/sdk-typescript (npm: `@roxyapi/sdk`)
- Python SDK: https://github.com/RoxyAPI/sdk-python (PyPI: `roxy-sdk`)
- MCP servers: https://roxyapi.com/docs/mcp
- Methodology and accuracy: https://roxyapi.com/methodology
- More starters: https://roxyapi.com/starters
- Pricing: https://roxyapi.com/pricing
