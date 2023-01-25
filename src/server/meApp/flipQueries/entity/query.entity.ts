import { TradeQueryType } from '../../types/TradeQueryType';

export class QueriesFlipEntity {
  itemBuying: TradeQueryType;
  itemSelling: TradeQueryType;
  itemSellingPriceMultiplier: number;
  uuid: string;
}
