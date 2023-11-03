import { type PoeTradeItemInfoType } from './Interface/PoeTradeItemInfo';
import { Price } from './Price/Price';
import { type ItemType } from './Types/ItemType';

export class Item implements ItemType {
  poeTradeLink: string;
  price: Price;
  name: string;
  maxStackSize: number;
  totalInTrade: number;

  constructor(
    poeTradeItemInfo: PoeTradeItemInfoType,
    poeTradeLink: string,
    itemName: string,
    priceMultiplier = 1,
  ) {
    const { result, total } = poeTradeItemInfo;
    this.maxStackSize = result[0]?.item.maxStackSize ?? 1;
    this.name = itemName;
    this.poeTradeLink = poeTradeLink;
    this.totalInTrade = total;
    this.price = new Price(result, this.maxStackSize, priceMultiplier);
  }
}
