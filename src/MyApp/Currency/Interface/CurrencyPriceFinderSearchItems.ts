import { TradeRequestType } from '../../API/Types/TradeRequestType';
import { PoeSecondResultType } from '../../API/Types/ResponsePoeFetch';

export interface CurrencyPriceFinderSearchItems {
  makeARequestToAnyItem: (requestQuery: TradeRequestType) => Promise<{
    result: PoeSecondResultType[];
    id: string;
    total: number;
  }>;
}
