import { apiClient } from './client';
import type {
  TarotCard,
  BasicCard,
  GetCardsResponse,
  DrawCardsRequest,
  DrawCardsResponse,
  DailyCardRequest,
  DailyCardResponse,
  ThreeCardSpreadRequest,
  ThreeCardSpreadResponse,
  CelticCrossRequest,
  LoveSpreadRequest,
  SpreadResponse,
  CustomSpreadRequest,
  YesNoRequest,
  YesNoResponse,
} from './types';

export const tarotApi = {
  getCards: async (): Promise<GetCardsResponse> => {
    const { data, error } = await apiClient.GET('/cards');
    if (error) throw new Error('Failed to fetch cards');
    return data;
  },

  getCardById: async (id: string): Promise<TarotCard> => {
    const { data, error } = await apiClient.GET('/cards/{id}', {
      params: { path: { id } },
    });
    if (error) throw new Error('Card not found');
    return data;
  },

  drawCards: async (params: DrawCardsRequest): Promise<DrawCardsResponse> => {
    const { data, error } = await apiClient.POST('/draw', { body: params });
    if (error) throw new Error('Failed to draw cards');
    return data;
  },

  getDailyCard: async (params?: DailyCardRequest): Promise<DailyCardResponse> => {
    const { data, error } = await apiClient.POST('/daily', { body: params || {} });
    if (error) throw new Error('Failed to get daily card');
    return data;
  },

  getThreeCardSpread: async (params?: ThreeCardSpreadRequest): Promise<ThreeCardSpreadResponse> => {
    const { data, error } = await apiClient.POST('/spreads/three-card', { body: params || {} });
    if (error) throw new Error('Failed to get three-card spread');
    return data;
  },

  getCelticCross: async (params?: CelticCrossRequest): Promise<SpreadResponse> => {
    const { data, error } = await apiClient.POST('/spreads/celtic-cross', { body: params || {} });
    if (error) throw new Error('Failed to get Celtic Cross spread');
    return data;
  },

  getLoveSpread: async (params?: LoveSpreadRequest): Promise<SpreadResponse> => {
    const { data, error } = await apiClient.POST('/spreads/love', { body: params || {} });
    if (error) throw new Error('Failed to get love spread');
    return data;
  },

  getCareerSpread: async (params?: { question?: string; seed?: string }): Promise<SpreadResponse> => {
    const { data, error } = await apiClient.POST('/spreads/career', { body: params || {} });
    if (error) throw new Error('Failed to get career spread');
    return data;
  },

  getCustomSpread: async (params: CustomSpreadRequest): Promise<SpreadResponse> => {
    const { data, error } = await apiClient.POST('/spreads/custom', { body: params });
    if (error) throw new Error('Failed to get custom spread');
    return data;
  },

  getYesNo: async (params: YesNoRequest): Promise<YesNoResponse> => {
    const { data, error } = await apiClient.POST('/yes-no', { body: params });
    if (error) throw new Error('Failed to get yes/no answer');
    return data;
  },
};
