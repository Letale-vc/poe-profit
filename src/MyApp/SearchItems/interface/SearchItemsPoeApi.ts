import { TradeRequestType } from '../../API/Types/TradeRequestType';
import {
  PoeFirstResponseType,
  PoeSecondResponseType,
} from '../../API/Types/ResponsePoeFetch';

export class SearchItemsPoeApi {
  leagueName: string;

  firsRequest: (
    requestQuery: TradeRequestType,
  ) => Promise<PoeFirstResponseType>;

  secondRequest: (
    arrayIds: string[],
    queryId: string,
  ) => Promise<PoeSecondResponseType>;
}
