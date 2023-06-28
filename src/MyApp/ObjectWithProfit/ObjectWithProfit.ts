import { CurrencyData } from '../Currency';
import { ObjectProfitDataType } from '../FileManagers';
import { ObjectRequestType } from '../FileManagers/PoeRequestManager/Types/ObjectRequestType';
import { round } from '../Helpers';
import { Item, PoeTradeItemInfoType } from '../Item';

export class ObjectWithProfit implements ObjectProfitDataType {
  itemBuying;
  requestUuid;
  itemSelling;
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
    this.profitInDivine = profitAll.divine;
    this.profitInChaos = profitAll.chaos;
    const profitPerTradeAll = this.calculateProfitPerTrade(profitAll);
    this.profitPerTradeInDivine = profitPerTradeAll.divine;
    this.profitPerTradeInChaos = profitPerTradeAll.chaos;
  }

  calculateProfit() {
    const { fullStackSize } = this.itemBuying.price;
    const { oneItem } = this.itemSelling.price;
    const profitAll = new CurrencyData();
    for (const [currency, buyingPrice] of Object.entries<number>(
      fullStackSize,
    )) {
      const decimalPlaces = currency === 'chaos' ? 0 : 2;
      const sellingPrice = oneItem[currency];
      const profit = round(+sellingPrice - buyingPrice, decimalPlaces);
      profitAll[currency] = profit;
    }
    return profitAll;
  }

  calculateProfitPerTrade(profitAll: CurrencyData) {
    const profitPerTradeAll = new CurrencyData();
    for (const [currency, profit] of Object.entries(profitAll)) {
      const decimalPlaces = currency === 'chaos' ? 0 : 2;
      const profitPerTrade = round(
        profit / this.itemBuying.maxStackSize,
        decimalPlaces,
      );
      profitPerTradeAll[currency] = profitPerTrade;
    }
    return profitPerTradeAll;
  }
  findPriceMultiplier = (poeTradeItemInfo: PoeTradeItemInfoType) => {
    const explicitMods = poeTradeItemInfo?.result[0]?.item?.explicitMods;

    if (explicitMods && explicitMods.length > 0) {
      const str = explicitMods[0];
      const match = str.match(/\d+x/i);
      if (match) {
        const number = parseInt(match[0], 10);
        return number;
      }
    }

    return 1;
  };
}
