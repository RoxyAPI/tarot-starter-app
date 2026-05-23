# Agents Guide

This is a RoxyAPI starter app. A tarot reading app built with React Native, Expo SDK 54, and TypeScript. Ships with the full 78 card Rider Waite deck, daily readings, multi card spreads, and yes or no divination, all powered by the RoxyAPI Tarot API through the official `@roxyapi/sdk`.

## Setup
- Get an API key at https://roxyapi.com/pricing
- Create `.env` in the project root with:
  - `EXPO_PUBLIC_ROXYAPI_KEY=your_api_key_here`
- Install with `npm install`
- Run with `npm start`, then `npm run ios`, `npm run android`, or `npm run web`
- Test with `npm test`, typecheck with `npm run typecheck`

## How it calls RoxyAPI
- The only data layer is `@roxyapi/sdk`. `createRoxy(key)` sets the base URL and the auth header, and ships its own types from the OpenAPI spec, so there is no generated schema file to keep in sync.
- The key is bundled into the app (mobile has no server). Treat `EXPO_PUBLIC_ROXYAPI_KEY` as a public, restricted key locked to your bundle id, or proxy calls through a backend you control.
- Live OpenAPI spec: https://roxyapi.com/api/v2/tarot/openapi.json
- Live playground: https://roxyapi.com/api-reference

## Endpoints used in this app
- `roxy.tarot.getDailyCard` for a seeded daily card with consistent results per device
- `roxy.tarot.castThreeCard` for past, present, future readings
- `roxy.tarot.castCelticCross` for the 10 card Celtic Cross
- `roxy.tarot.castYesNo` for yes or no divination with strength
- `roxy.tarot.castLoveSpread` and `roxy.tarot.castCareerSpread` for themed spreads
- `roxy.tarot.drawCards` for random single or multi card draws
- `roxy.tarot.listCards` for the full 78 card deck with images
- `roxy.tarot.getCard` for detailed upright and reversed meanings for a single card

## Where to extend
- `src/api/client.ts` is the single Roxy SDK client and the `hasApiKey` guard.
- `src/api/tarot.ts` wraps the `roxy.tarot.*` methods used by screens and unwraps the SDK `{ data, error }` result.
- `src/api/types.ts` re-exports the SDK response types under app-friendly names.
- `app/(tabs)/` holds the tab screens: `index.tsx` (daily), `browse.tsx`, `draw.tsx`, `spreads.tsx`, `yes-no.tsx`.

## Conventions
- All RoxyAPI calls go through `src/api/`. Do not call `fetch` or the SDK directly from screens.
- Method names and body fields come from the SDK types, never invented. Verify against the OpenAPI spec.
- Daily card seeding uses a stable device id from `AsyncStorage` so the daily card stays consistent across sessions.

## Resources
- TypeScript SDK: https://github.com/RoxyAPI/sdk-typescript (npm: `@roxyapi/sdk`)
- Python SDK: https://github.com/RoxyAPI/sdk-python (PyPI: `roxy-sdk`)
- MCP servers: https://roxyapi.com/docs/mcp
- Methodology and accuracy: https://roxyapi.com/methodology
- More starters: https://roxyapi.com/starters
- Pricing: https://roxyapi.com/pricing
