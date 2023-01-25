import { PriceEntity } from '../../priceCalculation/entity/PriceEntity';

export class ItemInfoEntity {
  poeTradeLink: string;
  price: PriceEntity;
  name: string;
  maxStackSize: number;
  totalInTrade: number;
  quality?: number;
}
