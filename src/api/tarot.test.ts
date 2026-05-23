/**
 * Tests for the tarot data layer. `@roxyapi/sdk` is mocked, so these run offline with no real key. They prove every `tarotApi` method calls the matching SDK method with the spec body shape, unwraps `data`, and turns an SDK `{ error }` result into a thrown message the screens can catch.
 *
 * The mock SDK builds its tarot client once and returns the same instance from every `createRoxy` call, so the test can grab the same `jest.fn` handles the data layer holds. The factory is self-contained to satisfy the `jest.mock` hoisting rule.
 */

import { createRoxy } from '@roxyapi/sdk';

jest.mock('@roxyapi/sdk', () => {
  const tarot = {
    listCards: jest.fn(),
    getCard: jest.fn(),
    drawCards: jest.fn(),
    getDailyCard: jest.fn(),
    castThreeCard: jest.fn(),
    castCelticCross: jest.fn(),
    castLoveSpread: jest.fn(),
    castCareerSpread: jest.fn(),
    castYesNo: jest.fn(),
  };
  return { createRoxy: () => ({ tarot }) };
});

import { tarotApi } from './tarot';

const mockTarot = createRoxy('test-key').tarot as unknown as Record<string, jest.Mock>;

const ok = <T>(data: T) => ({ data, error: undefined });

beforeEach(() => {
  for (const fn of Object.values(mockTarot)) fn.mockReset();
});

describe('tarotApi success paths', () => {
  it('getCards calls listCards and returns the card list', async () => {
    mockTarot.listCards.mockResolvedValue(ok({ total: 78, limit: 78, offset: 0, cards: [] }));
    const result = await tarotApi.getCards();
    expect(mockTarot.listCards).toHaveBeenCalledWith();
    expect(result.total).toBe(78);
  });

  it('getCardById forwards the id as a path param', async () => {
    mockTarot.getCard.mockResolvedValue(ok({ id: 'the-fool', name: 'The Fool' }));
    const card = await tarotApi.getCardById('the-fool');
    expect(mockTarot.getCard).toHaveBeenCalledWith({ path: { id: 'the-fool' } });
    expect(card.name).toBe('The Fool');
  });

  it('drawCards forwards the count in the body', async () => {
    mockTarot.drawCards.mockResolvedValue(ok({ cards: [] }));
    await tarotApi.drawCards({ count: 3 });
    expect(mockTarot.drawCards).toHaveBeenCalledWith({ body: { count: 3 } });
  });

  it('getDailyCard seeds per device and returns the card', async () => {
    mockTarot.getDailyCard.mockResolvedValue(ok({ date: '2026-05-23', card: { name: 'The Sun' } }));
    const daily = await tarotApi.getDailyCard({ seed: 'user-1', date: '2026-05-23' });
    expect(mockTarot.getDailyCard).toHaveBeenCalledWith({ body: { seed: 'user-1', date: '2026-05-23' } });
    expect(daily.card.name).toBe('The Sun');
  });

  it('getDailyCard sends an empty body when called with no args', async () => {
    mockTarot.getDailyCard.mockResolvedValue(ok({ date: '2026-05-23', card: {} }));
    await tarotApi.getDailyCard();
    expect(mockTarot.getDailyCard).toHaveBeenCalledWith({ body: {} });
  });

  it('getThreeCardSpread casts the three-card spread', async () => {
    mockTarot.castThreeCard.mockResolvedValue(ok({ spread: 'Three-Card', positions: [] }));
    const spread = await tarotApi.getThreeCardSpread({ question: 'My quarter' });
    expect(mockTarot.castThreeCard).toHaveBeenCalledWith({ body: { question: 'My quarter' } });
    expect(spread.spread).toBe('Three-Card');
  });

  it('getCelticCross casts the Celtic Cross spread', async () => {
    mockTarot.castCelticCross.mockResolvedValue(ok({ spread: 'Celtic Cross', positions: [] }));
    await tarotApi.getCelticCross();
    expect(mockTarot.castCelticCross).toHaveBeenCalledWith({ body: {} });
  });

  it('getYesNo asks the cards and returns the verdict', async () => {
    mockTarot.castYesNo.mockResolvedValue(ok({ answer: 'Yes', strength: 'Strong', card: {}, interpretation: '' }));
    const verdict = await tarotApi.getYesNo({ question: 'Should I take the offer?' });
    expect(mockTarot.castYesNo).toHaveBeenCalledWith({ body: { question: 'Should I take the offer?' } });
    expect(verdict.answer).toBe('Yes');
  });
});

describe('tarotApi error paths', () => {
  it('throws when the SDK returns an error result', async () => {
    mockTarot.castYesNo.mockResolvedValue({ data: undefined, error: { error: 'boom', code: 'internal_error' } });
    await expect(tarotApi.getYesNo({ question: 'x' })).rejects.toThrow('Failed to get yes/no answer');
  });

  it('throws when the SDK returns no data', async () => {
    mockTarot.listCards.mockResolvedValue({ data: undefined, error: undefined });
    await expect(tarotApi.getCards()).rejects.toThrow('Failed to fetch cards');
  });
});
