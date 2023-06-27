import { PoeSecondResultType } from '../../../API/Types/ResponsePoeFetch';
import { CurrencyDataType } from '../../../Currency';

export interface ItemPriceCalculationInterface {
  getPricesInChaos: (
    itemsArray: PoeSecondResultType[],
    total: number,
    maxStackSize: number,
    priceMultiplier: number,
  ) => PriceInChaosType;
  calculatePricesInAllCurrencies: (
    priceInChaos: number,
    maxStackSize?: number,
  ) => CurrencyDataType;
}

export interface PriceInChaosType {
  itemPriceInChaos: number;
  fullStackSizeInChaos: number;
}
