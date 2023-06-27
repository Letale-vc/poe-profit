import { PoeSecondResultType } from '../../API/Types/ResponsePoeFetch';
import { ItemPriceCalculation } from './priceCalculation/priceCalculation';
import { PriceType } from './Type/PriceType';

export class Price implements PriceType {
  oneItem;
  fullStackSize;
  constructor(
    itemsArray: PoeSecondResultType[],
    total: number,
    maxStackSize: number,
    priceMultiplier: number,
  ) {
    const priceCalculator = ItemPriceCalculation.getInstance();
    const priceInChaos = priceCalculator.getPricesInChaos(
      itemsArray,
      total,
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
