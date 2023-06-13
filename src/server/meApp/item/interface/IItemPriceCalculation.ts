import { PriceEntity } from '../../priceCalculation/entity/PriceEntity';
import { PoeSecondResultType } from '../../types/response-poe-fetch';

export interface IItemPriceCalculation {
  getItemPrice: (
    arrayListing: PoeSecondResultType[],
    total: number,
    maxStackSize: number,
    priceMultiplier: number,
  ) => PriceEntity;
}
