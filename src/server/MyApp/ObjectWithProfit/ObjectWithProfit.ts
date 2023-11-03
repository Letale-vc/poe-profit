import { type CurrencyNamesType } from '../Currency';
import { type ObjectProfitDataType } from '../FileManagers';
import { type ObjectRequestType } from '../FileManagers/PoeRequestManager/Types/ObjectRequestType';
import { type Entries, round } from '../Helpers';
import {
  type CurrencyRateType,
  Item,
  type PoeTradeItemInfoType,
} from '../Item';

export class ObjectWithProfit implements ObjectProfitDataType {
  itemBuying: Item;
  requestUuid: string;
  itemSelling: Item;
  profitInDivine: number;
  profitInChaos: number;
  profitPerTradeInDivine: number;
  profitPerTradeInChaos: number;

  constructor(
    poeTradeItemBuyingInfo: PoeTradeItemInfoType,
    poeTradeItemSellingInfo: PoeTradeItemInfoType,
    flipRequest: ObjectRequestType,
  ) {
    this.requestUuid = flipRequest.uuid;
    this.itemBuying = new Item(
      poeTradeItemBuyingInfo,
      flipRequest.itemBuying.url,
      flipRequest.itemBuying.name,
    );
    this.itemSelling = new Item(
      poeTradeItemSellingInfo,
      flipRequest.itemSelling.url,
      flipRequest.itemSelling.name,
      this.findPriceMultiplier(poeTradeItemBuyingInfo),
    );
    const profitAll = this.calculateProfit();
    this.profitInDivine = profitAll.get('divine') ?? NaN;
    this.profitInChaos = profitAll.get('chaos') ?? NaN;
    const profitPerTradeAll = this.calculateProfitPerTrade(profitAll);
    this.profitPerTradeInDivine = profitPerTradeAll.get('divine') ?? NaN;
    this.profitPerTradeInChaos = profitPerTradeAll.get('chaos') ?? NaN;
  }

  private calculateProfit(): Map<CurrencyNamesType, number> {
    const { fullStackSize } = this.itemBuying.price;
    const { oneItem } = this.itemSelling.price;
    const profitAll = new Map<CurrencyNamesType, number>();
    for (const [currency, buyingPrice] of Object.entries(
      fullStackSize,
    ) as Entries<CurrencyRateType>) {
      const decimalPlaces = currency === 'chaos' ? 0 : 2;
      const sellingPrice = oneItem[currency];
      const profit = round(+sellingPrice - buyingPrice, decimalPlaces);
      profitAll.set(currency, profit);
    }
    return profitAll;
  }

  private calculateProfitPerTrade(
    profitAll: Map<CurrencyNamesType, number>,
  ): Map<CurrencyNamesType, number> {
    const profitPerTradeAll = new Map<CurrencyNamesType, number>();
    for (const [currency, profit] of profitAll.entries()) {
      const decimalPlaces = currency === 'chaos' ? 0 : 2;
      const profitPerTrade = round(
        profit / this.itemBuying.maxStackSize,
        decimalPlaces,
      );
      profitPerTradeAll.set(currency, profitPerTrade);
    }
    return profitPerTradeAll;
  }

  private findPriceMultiplier = (poeTradeItemInfo: PoeTradeItemInfoType) => {
    const explicitMods = poeTradeItemInfo?.result[0]?.item?.explicitMods;
    if (explicitMods && explicitMods.length > 0) {
      const str = explicitMods[0];
      const match = str?.match(/\d+x/i);
      if (match) {
        const number = parseInt(match[0], 10);
        return number;
      }
    }
    return 1;
  };
}
