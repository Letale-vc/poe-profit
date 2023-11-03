import { type PriceType } from '../Price/Type/PriceType';

export interface ItemType {
  poeTradeLink: string;
  price: PriceType;
  name: string;
  maxStackSize: number;
  totalInTrade: number;
}
