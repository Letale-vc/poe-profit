import { PriceEntity } from '../../priceCalculation/entity/PriceEntity';
import { PoeSecondResult } from '../../types/response-poe-fetch';

export interface IItemPriceCalculation {
  getItemPrice: (
    arrayListing: PoeSecondResult[],
    total: number,
    maxStackSize: number,
    priceMultiplier: number,
  ) => PriceEntity;
}
