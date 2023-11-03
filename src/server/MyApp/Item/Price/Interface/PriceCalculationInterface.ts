import { type PoeSecondResultType } from "poe-trade-fetch";
import { type CurrencyRateType } from "../Type/PriceType";

export interface ItemPriceCalculationInterface {
  getPricesInChaos: (
    itemsArray: PoeSecondResultType[],
    total: number,
    maxStackSize: number,
    priceMultiplier: number
  ) => PriceInChaosType;
  calculatePricesInAllCurrencies: (
    priceInChaos: number,
    maxStackSize?: number
  ) => CurrencyRateType;
}

export interface PriceInChaosType {
  itemPriceInChaos: number;
  fullStackSizeInChaos: number;
}
