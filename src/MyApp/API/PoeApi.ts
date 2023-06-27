import axios, {
  AxiosInstance,
  CreateAxiosDefaults,
  AxiosRequestConfig,
  AxiosRequestHeaders,
} from 'axios';
import { TradeRequestType } from './Types/TradeRequestType';

import {
  PoeFirstResponseType,
  PoeSecondResponseType,
  PoeTradeDataItemsResponseType,
  ResponseLeagueListType,
} from './Types/ResponsePoeFetch';
import { delay } from '../Helpers';
import { SearchItemsPoeApi } from '../SearchItems';
import { PoeRequestManagerPoeApi } from '../FileManagers';
import { PoeFlipError } from '../Error/PoeFlipError';

// Власний тип для InternalAxiosRequestConfig
export interface InternalAxiosRequestConfig<D = any>
  extends AxiosRequestConfig<D> {
  headers: AxiosRequestHeaders;
}
export class PoeApi implements SearchItemsPoeApi, PoeRequestManagerPoeApi {
  private static instance: PoeApi;
  leagueName: string;
  // Статичний метод для отримання єдиного екземпляру класу

  private readonly POE_TRADE_SEARCH_URL =
    'https://www.pathofexile.com/trade/search/:league/:id';
  private readonly POE_API_LEAGUES_URL =
    'https://www.pathofexile.com/api/trade/data/leagues/';
  private readonly POE_API_ITEMS_URL =
    'https://www.pathofexile.com/api/trade/data/items/';

  private readonly DO_NOT_DELAYED_THIS_URLS = [
    this.POE_API_LEAGUES_URL,
    this.POE_API_ITEMS_URL,
  ];

  private readonly defaultOptions: CreateAxiosDefaults = {
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'poe_flip letalerv@gmail.com',
      access: '*/*',
    },
  };

  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create(this.defaultOptions);

    // Додаємо затримку перед любим запитом, щоб не получити блокування запитів на PoE сайті
    this.axiosInstance.interceptors.request.use(
      async (
        config: InternalAxiosRequestConfig,
      ): Promise<InternalAxiosRequestConfig> => {
        if (
          config.url &&
          !this.DO_NOT_DELAYED_THIS_URLS.includes(config.url) &&
          !config.url.includes(`https://www.pathofexile.com/trade/search/`)
        ) {
          await delay(10); // Затримка 10 секунд перед кожним запитом
        }
        return config;
      },
      async (err) => {
        throw new PoeFlipError(err);
      },
    );

    this.axiosInstance.interceptors.response.use(
      async (res) => {
        return res;
      },
      async (err) => {
        throw new PoeFlipError(err);
      },
    );
  }
  // constructor END

  public static async getInstance(): Promise<PoeApi> {
    // Якщо екземпляр ще не існує, створіть його
    if (!PoeApi.instance) {
      PoeApi.instance = new PoeApi();
      await PoeApi.instance.init();
    }
    return PoeApi.instance;
  }
  private async init(): Promise<void> {
    this.leagueName = await this._takeLeagueName();
  }

  private _takeLeagueName = async () => {
    const { data } = await this.axiosInstance.get<ResponseLeagueListType>(
      this.POE_API_LEAGUES_URL,
    );
    const leaguePc = data.result.filter((el) => el.realm === 'pc');
    const leagueName =
      leaguePc.find(
        (el) =>
          !el.id.toLowerCase().includes('standard') &&
          !el.id.toLowerCase().includes('hardcore') &&
          !el.id.toLowerCase().includes('Ruthless'),
      )?.text || 'standard';
    return leagueName;
  };

  async tradeDataItems() {
    const { data } =
      await this.axiosInstance.get<PoeTradeDataItemsResponseType>(
        this.POE_API_ITEMS_URL,
      );
    return data;
  }

  async firsRequest(requestQuery: TradeRequestType) {
    const baseUrl = 'https://www.pathofexile.com/api/trade/search/:league';
    // Додаємо шлях ліги та створюємо URL
    const url = new URL(baseUrl.replace(':league', this.leagueName));
    const { data } = await this.axiosInstance.post<PoeFirstResponseType>(
      url.toString(),
      requestQuery,
    );
    return data;
  }

  async secondRequest(arrayIds: string[], queryId: string) {
    const baseUrl = 'https://www.pathofexile.com/api/trade/fetch/';
    const url = new URL(baseUrl);

    // Додаємо список ідентифікаторів до URL
    url.pathname += arrayIds.join(',');

    // Додаємо параметр запиту queryId
    url.searchParams.set('query', queryId);

    const { data } = await this.axiosInstance.get<PoeSecondResponseType>(
      url.toString(),
    );
    return data;
  }
  tradeSearch = async (queryId: string, poesessid: string) => {
    this.axiosInstance.defaults.headers.common[
      'Cookie'
    ] = `POESESSID=${poesessid}`;
    const baseUrl = this.POE_TRADE_SEARCH_URL;
    const addLeagueUrl = baseUrl.replace(':league', this.leagueName);
    const addQueryId = addLeagueUrl.replace(':id', queryId);
    const url = new URL(addQueryId);
    const { data } = await this.axiosInstance.get(url.toString());

    return data;
  };
}
