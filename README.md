# Tarot Starter App

[![Get API Key](https://img.shields.io/badge/Get_API_Key-roxyapi.com-black?style=for-the-badge)](https://roxyapi.com/pricing)
[![API Docs](https://img.shields.io/badge/API_Docs-Reference-black?style=for-the-badge)](https://roxyapi.com/api-reference#tag/tarot)
[![License: MIT](https://img.shields.io/badge/License-MIT-black?style=for-the-badge)](https://github.com/RoxyAPI/tarot-starter-app/blob/main/LICENSE)

Open-source React Native (Expo) template for a tarot reading app: daily card, three-card spread, Celtic Cross, yes / no divination, and the full 78-card Rider-Waite-Smith deck. Built on the [Roxy](https://roxyapi.com) Tarot API and the official [@roxyapi/sdk](https://www.npmjs.com/package/@roxyapi/sdk). One API key, every tarot endpoint, full control over your native UI.

Fork it, set one environment variable, and ship.

## Screenshots

### Light Mode
<p align="center">
  <img src="https://raw.githubusercontent.com/RoxyAPI/tarot-starter-app/main/screenshots/01.webp" width="250" />
  <img src="https://raw.githubusercontent.com/RoxyAPI/tarot-starter-app/main/screenshots/02.webp" width="250" />
  <img src="https://raw.githubusercontent.com/RoxyAPI/tarot-starter-app/main/screenshots/03.webp" width="250" />
</p>
<p align="center">
  <img src="https://raw.githubusercontent.com/RoxyAPI/tarot-starter-app/main/screenshots/04.webp" width="250" />
  <img src="https://raw.githubusercontent.com/RoxyAPI/tarot-starter-app/main/screenshots/05.webp" width="250" />
  <img src="https://raw.githubusercontent.com/RoxyAPI/tarot-starter-app/main/screenshots/06.webp" width="250" />
</p>

### Dark Mode
<p align="center">
  <img src="https://raw.githubusercontent.com/RoxyAPI/tarot-starter-app/main/screenshots/01-dark.webp" width="250" />
  <img src="https://raw.githubusercontent.com/RoxyAPI/tarot-starter-app/main/screenshots/02-dark.webp" width="250" />
  <img src="https://raw.githubusercontent.com/RoxyAPI/tarot-starter-app/main/screenshots/03-dark.webp" width="250" />
</p>

## What you get

- **Daily card** seeded per device, so a user sees the same card all day, with upright or reversed meaning and full artwork.
- **Browse all 78 cards** filtered by Major Arcana, Minor Arcana, and suit (Cups, Wands, Swords, Pentacles).
- **Quick draw** of 1 to 10 random cards with position and reversal state.
- **Spreads**: Three-Card (Past, Present, Future), Celtic Cross (ten positions), Love, and Career, each with position-specific interpretations and a summary.
- **Yes / No divination** with a Strong or Qualified strength and a contextual reading.
- **Card detail** with the complete upright and reversed interpretation for every card.
- **Dark mode** with a violet theme that follows the device setting.

## Stack

| Technology | Purpose |
|-----------|---------|
| [Expo SDK 54](https://expo.dev) | React Native runtime and build tooling |
| [Expo Router](https://docs.expo.dev/router/introduction/) | File-based navigation with bottom tabs |
| [@roxyapi/sdk](https://www.npmjs.com/package/@roxyapi/sdk) | Fully typed RoxyAPI client. One key, every domain. |
| [NativeWind v4](https://www.nativewind.dev) | Tailwind CSS for React Native |
| [Expo Image](https://docs.expo.dev/versions/latest/sdk/image/) | Cached card artwork |
| [Roxy Tarot API](https://roxyapi.com/products/tarot-api) | 78-card Rider-Waite-Smith deck, spreads, and divination |

## Quick start

### 1. Clone and install

```bash
git clone https://github.com/RoxyAPI/tarot-starter-app.git
cd tarot-starter-app
npm install
```

### 2. Get your API key

Get instant access at **[roxyapi.com/pricing](https://roxyapi.com/pricing)**. One key unlocks every tarot endpoint. Add it to `.env`:

```
EXPO_PUBLIC_ROXYAPI_KEY=your-api-key-here
```

> **Bundled key caveat.** A mobile app has no server, so any `EXPO_PUBLIC_*` value is compiled into the build and can be read off a device. For production, use a key restricted to your bundle id in the dashboard, or route calls through a thin backend proxy that holds the real key. Never ship an unrestricted key.

### 3. Run

```bash
npm start          # dev server, then press i, a, or w
npm run ios        # iOS simulator (macOS only)
npm run android    # Android emulator
npm run web        # web
```

## How it works

The SDK is the only data layer. There is no generated schema file to keep in sync: `@roxyapi/sdk` ships its own types from the same OpenAPI spec the API serves, so a response flows straight into a screen with no glue code.

### One typed client

```ts
// src/api/client.ts
import { createRoxy } from '@roxyapi/sdk';

const key = process.env.EXPO_PUBLIC_ROXYAPI_KEY ?? '';
export const roxy = createRoxy(key);
export const hasApiKey = (): boolean => Boolean(key);
```

### One data layer, screens stay thin

Every screen imports from `src/api`. The data layer wraps each `roxy.tarot.*` call and unwraps the SDK `{ data, error }` result into either the response or one thrown error the screen can catch:

```ts
// src/api/tarot.ts
export const tarotApi = {
  getDailyCard: async (body) => unwrap(await roxy.tarot.getDailyCard({ body }), 'Failed to get daily card'),
  // ...
};
```

```tsx
// app/(tabs)/index.tsx
const data = await tarotApi.getDailyCard({ seed: deviceId, date: today });
// data.card.name, data.card.imageUrl, data.dailyMessage
```

## Featured endpoints

The highest-demand tarot endpoints, in the order you are most likely to ship them. Every method name and field below comes from the [OpenAPI spec](https://roxyapi.com/api/v2/tarot/openapi.json).

```ts
import { createRoxy } from '@roxyapi/sdk';

const roxy = createRoxy(process.env.EXPO_PUBLIC_ROXYAPI_KEY!);

// 1. Daily card. The stickiest tarot feature. Seed per device for the same card all day.
const { data: daily } = await roxy.tarot.getDailyCard({ body: { seed: 'device-42' } });
// daily.card.name, daily.card.imageUrl, daily.dailyMessage

// 2. Three-card spread. Past, present, future. The most-drawn spread on every tarot surface.
const { data: three } = await roxy.tarot.castThreeCard({ body: { question: 'My next quarter' } });
// three.positions[].name, three.positions[].card, three.positions[].interpretation

// 3. Celtic Cross. The professional-reader spread, ten positions.
const { data: cross } = await roxy.tarot.castCelticCross({ body: { question: 'What should I focus on?' } });

// 4. Yes / No. The impulse micro-query, highest first-call conversion.
const { data: verdict } = await roxy.tarot.castYesNo({ body: { question: 'Should I take the offer?' } });
// verdict.answer ("Yes" | "No" | "Maybe"), verdict.strength

// 5. Card catalog. Fetch once, cache. The highest per-endpoint call count in the deck.
const { data: deck } = await roxy.tarot.listCards();
// deck.total (78), deck.cards[].name, deck.cards[].imageUrl
```

This template uses 9 of the tarot endpoints. Browse the rest in the [API reference](https://roxyapi.com/api-reference#tag/tarot).

## Project structure

```
app/                          # Expo Router screens
├── _layout.tsx               # Root Stack
├── (tabs)/
│   ├── _layout.tsx           # Bottom tabs
│   ├── index.tsx             # Daily card
│   ├── browse.tsx            # Browse 78 cards with filters
│   ├── draw.tsx              # Quick draw 1 to 10 cards
│   ├── spreads.tsx           # Spread selection and reading
│   └── yes-no.tsx            # Yes / No divination
└── card/[id].tsx             # Card detail
src/
├── api/
│   ├── client.ts             # The one Roxy SDK client + hasApiKey guard
│   ├── tarot.ts              # Wraps roxy.tarot.*, unwraps { data, error }
│   ├── types.ts              # SDK response types under app-friendly names
│   └── index.ts              # Barrel export
├── components/RoxyBranding.tsx
├── constants/colors.ts       # appColors for React Native props
└── hooks/useUserId.ts        # Stable device id in AsyncStorage, used as the daily seed
```

## Customize

- **Add a feature.** Pick a tarot method, add a wrapper in `src/api/tarot.ts`, call it from a screen. The SDK types regenerate from the spec, so new endpoints flow through with no manual typing.
- **Change the theme.** This app uses Tailwind colors through NativeWind. Swap `violet-600` in the screen `className` strings for any Tailwind color, and update `appColors.primary` in `src/constants/colors.ts` for the React Native props.
- **Add a spread.** The four spread endpoints share one response shape, so a new spread is one wrapper plus one entry in the spreads list.

## Why Roxy

- **Breadth.** Tarot plus Western astrology, Vedic astrology, numerology, biorhythm, I Ching, crystals, dreams, and angel numbers under one key.
- **Type-safe.** The SDK types come from one OpenAPI pipeline, so response shapes cannot drift from what the API returns.
- **Eight languages.** Pass `query: { lang }` on the reading endpoints for interpretations in English, Hindi, Turkish, Spanish, German, Portuguese, French, or Russian.
- **Remote MCP.** Connect AI agents to every tarot endpoint at `roxyapi.com/mcp/tarot`, no local setup.

## Links

- [Tarot API](https://roxyapi.com/products/tarot-api)
- [API reference and playground](https://roxyapi.com/api-reference#tag/tarot)
- [Get API key](https://roxyapi.com/pricing)
- [All templates](https://roxyapi.com/starters)
- [Connect AI agents via MCP](https://roxyapi.com/docs/mcp)

## License

MIT
