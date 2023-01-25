import { IPoeTradeItemInfo } from '../../item/interface/IPoeTradeItemInfo';
import { TradeQueryType } from '../../types/TradeQueryType';
import { ItemInfoEntity } from '../../item/entity/ItemInfo.entity';

export interface IFlipObjectItem {
  getItemInfo: (
    poeTradeItemInfo: IPoeTradeItemInfo,
    tradeQuery: TradeQueryType,
    priceMultiplier?: number,
  ) => ItemInfoEntity;
}
