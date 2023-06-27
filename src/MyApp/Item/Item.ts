import { PoeTradeItemInfoType } from './Interface/PoeTradeItemInfo';
import { Price } from './Price/Price';
import { ItemType } from './Types/ItemType';

export class Item implements ItemType {
  poeTradeLink;
  price;
  name;
  maxStackSize;
  totalInTrade;

  constructor(
    poeTradeItemInfo: PoeTradeItemInfoType,
    poeTradeLink: string,
    itemName: string,
  ) {
    const { result, total } = poeTradeItemInfo;
    this.maxStackSize = result[0].item.maxStackSize || 1;
    this.name = itemName;
    this.poeTradeLink = poeTradeLink;
    this.totalInTrade = total;
    const priceMultiplier = this.findPriceMultiplier(poeTradeItemInfo);
    this.price = new Price(result, total, this.maxStackSize, priceMultiplier);
  }

  findPriceMultiplier = (poeTradeItemInfo: PoeTradeItemInfoType) => {
    const explicitMods = poeTradeItemInfo?.result[0]?.item?.explicitMods;

    if (explicitMods && explicitMods.length > 0) {
      const str = explicitMods[0];
      const match = str.match(/\d+x/);
      if (match) {
        const number = parseInt(match[0], 10);
        return number;
      }
    }

    return 1;
  };
}
