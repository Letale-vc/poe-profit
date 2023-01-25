import {
  PoeFirstResponse,
  PoeSecondResponse,
  PoeSecondResult,
  PoeTradeDataItemsResponse,
} from '../../types/response-poe-fetch';

export class PoeApiInterface {
  leagueName: string;

  init: () => Promise<void>;

  poeTradeDataItems: () => Promise<PoeTradeDataItemsResponse>;

  poeFirsRequest: (query: string) => Promise<PoeFirstResponse>;

  poeSecondRequest: (
    arrayIds: string[],
    queryId: string,
  ) => Promise<PoeSecondResponse>;

  makeARequestToAnyItem: (query: string) => Promise<{
    result: PoeSecondResult[];
    id: string;
    total: number;
  }>;
}
