import { type PoeSecondResultType } from 'poe-trade-fetch';
import { ItemPriceCalculation } from './priceCalculation/priceCalculation';
import { type PriceType } from './Type/PriceType';

export class Price implements PriceType {
  oneItem;
  fullStackSize;
  constructor(
    itemsArray: PoeSecondResultType[],
    maxStackSize: number,
    priceMultiplier: number,
  ) {
    const priceCalculator = ItemPriceCalculation.getInstance();
    const priceInChaos = priceCalculator.getPricesInChaos(
      itemsArray,
      maxStackSize,
      priceMultiplier,
    );
    this.oneItem = priceCalculator.calculatePricesInAllCurrencies(
      priceInChaos.itemPriceInChaos,
    );
    this.fullStackSize = priceCalculator.calculatePricesInAllCurrencies(
      priceInChaos.fullStackSizeInChaos,
      priceMultiplier,
    );
  }
}
