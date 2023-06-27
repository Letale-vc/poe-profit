import { ItemType } from '../../../Item';

export type ObjectProfitDataType = {
  itemBuying: ItemType;
  requestUuid: string;
  itemSelling: ItemType;
  profitInDivine: number;
  profitInChaos: number;
  profitPerTradeInDivine: number;
  profitPerTradeInChaos: number;
};
