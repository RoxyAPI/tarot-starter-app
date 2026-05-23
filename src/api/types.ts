/**
 * Tarot response types, re-exported from `@roxyapi/sdk` so the screens import stable names without depending on the SDK's path-based type names. The SDK ships these types from the same OpenAPI spec the API serves, so they cannot drift from the live responses.
 */

export type {
  BasicCard,
  Card,
  DrawnCard,
  GetTarotCardsResponse,
  GetTarotCardsByIdResponse,
  PostTarotDailyResponse as DailyCardResponse,
  PostTarotDrawResponse as DrawCardsResponse,
  PostTarotYesNoResponse as YesNoResponse,
} from '@roxyapi/sdk';

export type { SpreadResponse } from './tarot';

/** The single-card detail shape ({@link Card}), aliased to the name the card screen uses. */
export type { Card as TarotCard } from '@roxyapi/sdk';
