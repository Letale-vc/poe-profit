import { type PoeSecondResultType } from 'poe-trade-fetch';
import { CURRENCY_NAMES, type CurrencyNamesType } from '../../../Currency';
import { round } from '../../../Helpers';
import { type ItemPriceCalculationInterface } from '../Interface/PriceCalculationInterface';
import { type CurrencyRateType } from '../Type/PriceType';

export class ItemPriceCalculation implements ItemPriceCalculationInterface {
  private static instance: ItemPriceCalculation;
  currencyPriceInChaos = new Map<CurrencyNamesType, number>(
    CURRENCY_NAMES.map((el) => [el, 1]),
  );
  update(currencyPriceInChaos: Map<CurrencyNamesType, number>) {
    this.currencyPriceInChaos = currencyPriceInChaos;
  }

  static getInstance(): ItemPriceCalculation {
    // Якщо екземпляр ще не існує, створіть його
    if (!ItemPriceCalculation.instance) {
      ItemPriceCalculation.instance = new ItemPriceCalculation();
    }
    return ItemPriceCalculation.instance;
  }

  private convertAnyPriceInChaos = (
    value: number,
    currencyName: CurrencyNamesType,
  ) => {
    return value * (this.currencyPriceInChaos.get(currencyName) ?? 1);
  };

  private countPriceInChaos = (
    oldPrice: number,
    currentValueListingPrice: number,
    currencyName: CurrencyNamesType,
  ) => {
    const howMuchToDivide = oldPrice === 0 ? 1 : 2;
    const convertInChaos = this.convertAnyPriceInChaos(
      currentValueListingPrice,
      currencyName,
    );
    // count price and divide price
    const newPrice = (oldPrice + convertInChaos) / howMuchToDivide;
    return newPrice;
  };
  private calculatePriceInChaos = (
    itemsArray: PoeSecondResultType[],
  ): number => {
    const defaultInitialCount = [0, 0];

    const resultValue = itemsArray.reduce(
      (previousValue, currentValue, index) => {
        const currentValueListingPrice = currentValue.listing.price.amount; //?
        const currencyName = currentValue.listing.price
          .currency as CurrencyNamesType;
        if (!this.currencyPriceInChaos.has(currencyName)) {
          return previousValue;
        }
        if (previousValue[1] === 3) {
          return previousValue;
        }
        const newPrice = this.countPriceInChaos(
          previousValue[0],
          currentValueListingPrice,
          currencyName,
        );

        if (previousValue[0] !== 0) {
          const timeListedChecked = this.timeListedChecked(
            currentValue.listing.indexed,
            24,
          );
          const diffCheck = this.differenceChecked(previousValue[0], newPrice);
          if (index > 3 && diffCheck && timeListedChecked) {
            return previousValue;
          }
        }
        return [newPrice, previousValue[1] + 1];
      },
      defaultInitialCount,
    );

    return resultValue[0];
  };

  // Перевірка різниці  між попередньою та поточною ціною у відсотках
  private differenceChecked = (oldPrice: number, newPrice: number) => {
    const differenceToChaos = 10;
    const differenceInPercent = (newPrice / oldPrice) * 100 - 100;
    const doesItExistBigDifferencePrice =
      differenceInPercent > differenceToChaos;
    return doesItExistBigDifferencePrice;
  };

  // Перевірка часу, пройденого з моменту публікації оголошення на трейд сайті
  private timeListedChecked = (
    listingIndexedDate: Date,
    timeSkipInHours: number,
  ) => {
    // Calculating the time that has passed in milliseconds
    const timeSkipInMS = timeSkipInHours * 3.6e6;
    const timeInTrade = new Date(listingIndexedDate);
    const dateTimeNow = new Date();
    const timeListed = dateTimeNow.getTime() - timeInTrade.getTime();
    const timeListedChecked = timeListed > timeSkipInMS;
    return timeListedChecked;
  };

  getPricesInChaos(
    itemsArray: PoeSecondResultType[],
    maxStackSize: number,
    priceMultiplier = 1,
  ) {
    const itemPriceInChaos =
      this.calculatePriceInChaos(itemsArray) * priceMultiplier;
    const fullStackSizeInChaos =
      maxStackSize * itemPriceInChaos * priceMultiplier;
    return { itemPriceInChaos, fullStackSizeInChaos };
  }

  calculatePricesInAllCurrencies(
    priceInChaos: number,
    maxStackSize = 1,
  ): CurrencyRateType {
    const priceInAllCurrencies = new Map<CurrencyNamesType, number>();
    for (const [key, val] of this.currencyPriceInChaos.entries()) {
      const decimalPlaces = key === 'chaos' ? 0 : 2;
      priceInAllCurrencies.set(
        key,
        round((priceInChaos * maxStackSize) / val, decimalPlaces),
      );
    }
    return Object.fromEntries(priceInAllCurrencies) as CurrencyRateType;
  }
}
