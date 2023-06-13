import { TradeQueryType } from '../../types/TradeQueryType';
import {
  PoeFirstResponseType,
  PoeSecondResponseType,
} from '../../types/response-poe-fetch';

export class ISearchItemsPoeApi {
  leagueName: string;

  poeFirsRequest: (
    requestQuery: TradeQueryType,
  ) => Promise<PoeFirstResponseType>;

  poeSecondRequest: (
    arrayIds: string[],
    queryId: string,
  ) => Promise<PoeSecondResponseType>;
}
