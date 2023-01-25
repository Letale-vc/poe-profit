import { TradeQueryType } from '../../types/TradeQueryType';
import {
  PoeFirstResponse,
  PoeSecondResponse,
} from '../../types/response-poe-fetch';

export class SearchItemsPoeApi {
  leagueName: string;

  poeFirsRequest: (requestQuery: TradeQueryType) => Promise<PoeFirstResponse>;

  poeSecondRequest: (
    arrayIds: string[],
    queryId: string,
  ) => Promise<PoeSecondResponse>;
}
