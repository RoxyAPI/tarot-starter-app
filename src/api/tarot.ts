import { roxy } from './client';
import type {
  GetTarotCardsResponse,
  GetTarotCardsByIdResponse,
  PostTarotDrawData,
  PostTarotDrawResponse,
  PostTarotDailyData,
  PostTarotDailyResponse,
  PostTarotSpreadsThreeCardData,
  PostTarotSpreadsThreeCardResponse,
  PostTarotSpreadsCelticCrossData,
  PostTarotSpreadsCelticCrossResponse,
  PostTarotSpreadsLoveData,
  PostTarotSpreadsLoveResponse,
  PostTarotSpreadsCareerData,
  PostTarotSpreadsCareerResponse,
  PostTarotYesNoData,
  PostTarotYesNoResponse,
} from '@roxyapi/sdk';

type SdkResult<T> = { data?: T; error?: unknown };

/**
 * Unwrap a Roxy SDK result, returning `data` or throwing a screen-friendly message. The SDK never throws on a non-2xx response: it returns `{ data, error }`, so every call site funnels through here to turn an error into one thrown `Error` the screens can catch.
 */
const unwrap = <T>(result: SdkResult<T>, message: string): T => {
  if (result.error || !result.data) throw new Error(message);
  return result.data;
};

/** Body shapes for the spread and reading calls. Pulled from the SDK request types so the screens cannot drift from the spec. */
export type DrawCardsRequest = NonNullable<PostTarotDrawData['body']>;
export type DailyCardRequest = NonNullable<PostTarotDailyData['body']>;
export type ThreeCardSpreadRequest = NonNullable<PostTarotSpreadsThreeCardData['body']>;
export type CelticCrossRequest = NonNullable<PostTarotSpreadsCelticCrossData['body']>;
export type LoveSpreadRequest = NonNullable<PostTarotSpreadsLoveData['body']>;
export type CareerSpreadRequest = NonNullable<PostTarotSpreadsCareerData['body']>;
export type YesNoRequest = PostTarotYesNoData['body'];

/** Every spread endpoint returns the same `{ spread, positions, summary }` shape, so screens render any spread with one component. */
export type SpreadResponse =
  | PostTarotSpreadsThreeCardResponse
  | PostTarotSpreadsCelticCrossResponse
  | PostTarotSpreadsLoveResponse
  | PostTarotSpreadsCareerResponse;

export const tarotApi = {
  getCards: async (): Promise<GetTarotCardsResponse> =>
    unwrap(await roxy.tarot.listCards(), 'Failed to fetch cards'),

  getCardById: async (id: string): Promise<GetTarotCardsByIdResponse> =>
    unwrap(await roxy.tarot.getCard({ path: { id } }), 'Card not found'),

  drawCards: async (body: DrawCardsRequest): Promise<PostTarotDrawResponse> =>
    unwrap(await roxy.tarot.drawCards({ body }), 'Failed to draw cards'),

  getDailyCard: async (body?: DailyCardRequest): Promise<PostTarotDailyResponse> =>
    unwrap(await roxy.tarot.getDailyCard({ body: body ?? {} }), 'Failed to get daily card'),

  getThreeCardSpread: async (body?: ThreeCardSpreadRequest): Promise<PostTarotSpreadsThreeCardResponse> =>
    unwrap(await roxy.tarot.castThreeCard({ body: body ?? {} }), 'Failed to get three-card spread'),

  getCelticCross: async (body?: CelticCrossRequest): Promise<PostTarotSpreadsCelticCrossResponse> =>
    unwrap(await roxy.tarot.castCelticCross({ body: body ?? {} }), 'Failed to get Celtic Cross spread'),

  getLoveSpread: async (body?: LoveSpreadRequest): Promise<PostTarotSpreadsLoveResponse> =>
    unwrap(await roxy.tarot.castLoveSpread({ body: body ?? {} }), 'Failed to get love spread'),

  getCareerSpread: async (body?: CareerSpreadRequest): Promise<PostTarotSpreadsCareerResponse> =>
    unwrap(await roxy.tarot.castCareerSpread({ body: body ?? {} }), 'Failed to get career spread'),

  getYesNo: async (body: YesNoRequest): Promise<PostTarotYesNoResponse> =>
    unwrap(await roxy.tarot.castYesNo({ body }), 'Failed to get yes/no answer'),
};
