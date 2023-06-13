import {
  PoeFirstResponseType,
  PoeSecondResponseType,
  PoeSecondResultType,
  PoeTradeDataItemsResponseType,
} from '../../types/response-poe-fetch';

export class PoeApiInterface {
  leagueName: string;

  init: () => Promise<void>;

  poeTradeDataItems: () => Promise<PoeTradeDataItemsResponseType>;

  poeFirsRequest: (query: string) => Promise<PoeFirstResponseType>;

  poeSecondRequest: (
    arrayIds: string[],
    queryId: string,
  ) => Promise<PoeSecondResponseType>;

  makeARequestToAnyItem: (query: string) => Promise<{
    result: PoeSecondResultType[];
    id: string;
    total: number;
  }>;
}
