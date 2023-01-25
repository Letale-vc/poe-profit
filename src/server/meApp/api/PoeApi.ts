import axios, { AxiosInstance, CreateAxiosDefaults, isAxiosError } from 'axios';
import { TradeQueryType } from '../types/TradeQueryType';
import {
  PoeFirstResponse,
  PoeSecondResponse,
  PoeTradeDataItemsResponse,
  ResponseLeagueList,
} from '../types/response-poe-fetch';
import { SearchItemsPoeApi } from '../searchItems/interface/SearchItemsPoeApi.interface';

export class PoeApi implements SearchItemsPoeApi {
  leagueName: string;

  private readonly defaultOptions: CreateAxiosDefaults = {
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'poe_flip',
      access: '*/*',
    },
  };

  private instance: AxiosInstance;

  constructor(options?: CreateAxiosDefaults) {
    this.instance = axios.create(options || this.defaultOptions);

    this.instance.interceptors.response.use(
      (res) => {
        return res;
      },
      async (err) => {
        if (isAxiosError(err)) {
          const status = err.response?.status;
          if (status === 429) {
            throw new Error('0');
          }
        }
        throw new Error('1');
      },
    );
  }

  async init(): Promise<void> {
    this.leagueName = await this._takeLeagueName();
  }

  private async _takeLeagueName() {
    const { data } = await this.instance.get<ResponseLeagueList>(
      'https://www.pathofexile.com/api/trade/data/leagues',
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
  }

  async poeTradeDataItems() {
    const { data } = await this.instance.get<PoeTradeDataItemsResponse>(
      'https://www.pathofexile.com/api/trade/data/items',
    );
    return data;
  }

  async poeFirsRequest(requestQuery: TradeQueryType) {
    const { data } = await this.instance.post<PoeFirstResponse>(
      `https://www.pathofexile.com/api/trade/search/${this.leagueName}`,
      requestQuery,
    );
    return data;
  }

  async poeSecondRequest(arrayIds: string[], queryId: string) {
    const { data } = await this.instance.get<PoeSecondResponse>(
      `https://www.pathofexile.com/api/trade/fetch/${arrayIds.join(
        ',',
      )}?query=${queryId}`,
    );
    return data;
  }
}
