import { TradeQueryType } from '../../server/meApp/types/TradeQueryType';

export interface NewFlipQueriesType {
  itemBuying: string;
  itemSelling: string;
  itemSellingPriceMultiplier: number;
}

export interface FlipQueriesType extends NewFlipQueriesType {
  uuid: string;
}

export type QueryTypeSearch = TradeQueryType;
