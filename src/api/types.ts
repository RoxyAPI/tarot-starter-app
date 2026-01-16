/**
 * Type definitions for RoxyAPI Tarot API
 * Auto-generated from OpenAPI schema at https://roxyapi.com/api/v2/tarot/openapi.json
 * 
 * Regenerate with: npm run generate:types
 */

import type { paths, components } from './schema';

// Re-export OpenAPI types for convenience
export type TarotCard = components['schemas']['Card'];
export type BasicCard = components['schemas']['BasicCard'];
export type DrawnCard = components['schemas']['DrawnCard'];

// Response types
export type GetCardsResponse = paths['/cards']['get']['responses']['200']['content']['application/json'];
export type DrawCardsResponse = paths['/draw']['post']['responses']['200']['content']['application/json'];
export type DailyCardResponse = paths['/daily']['post']['responses']['200']['content']['application/json'];
export type ThreeCardSpreadResponse = paths['/spreads/three-card']['post']['responses']['200']['content']['application/json'];
export type SpreadResponse = paths['/spreads/celtic-cross']['post']['responses']['200']['content']['application/json'];
export type YesNoResponse = paths['/yes-no']['post']['responses']['200']['content']['application/json'];

// Request types - requestBody is required, just extract content
export type DrawCardsRequest = paths['/draw']['post']['requestBody']['content']['application/json'];
export type DailyCardRequest = paths['/daily']['post']['requestBody']['content']['application/json'];
export type ThreeCardSpreadRequest = paths['/spreads/three-card']['post']['requestBody']['content']['application/json'];
export type CelticCrossRequest = paths['/spreads/celtic-cross']['post']['requestBody']['content']['application/json'];
export type LoveSpreadRequest = paths['/spreads/love']['post']['requestBody']['content']['application/json'];
export type CustomSpreadRequest = paths['/spreads/custom']['post']['requestBody']['content']['application/json'];
export type YesNoRequest = paths['/yes-no']['post']['requestBody']['content']['application/json'];
