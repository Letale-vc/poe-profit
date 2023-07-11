import { PoeSecondResultType } from '../../../API/Types/ResponsePoeFetch';
import { CurrencyData } from '../../../Currency';
import { round } from '../../../Helpers';
import { ItemPriceCalculationInterface } from '../Interface/PriceCalculationInterface';
import { CurrencyPriceMap } from './interface/CurrencyPriceMap';

export class ItemPriceCalculation implements ItemPriceCalculationInterface {
  private static instance: ItemPriceCalculation;
  currencyPriceInChaos: CurrencyPriceMap;

  update = (currencyPriceInChaos: CurrencyPriceMap) => {
    this.currencyPriceInChaos = currencyPriceInChaos;
  };

  public static getInstance(): ItemPriceCalculation {
    // Якщо екземпляр ще не існує, створіть його
    if (!ItemPriceCalculation.instance) {
      ItemPriceCalculation.instance = new ItemPriceCalculation();
    }
    return ItemPriceCalculation.instance;
  }

  private convertAnyPriceInChaos = (value: number, currencyName: string) => {
    const convertInChaos = value * this.currencyPriceInChaos[currencyName];
    return convertInChaos;
  };

  private countPriceInChaos = (
    oldPrice: number,
    currentValueListingPrice: number,
    currencyName: string,
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
    const defaultInitialCount = 0;

    const resultValue = itemsArray.reduce(
      (previousValue, currentValue, index) => {
        const currentValueListingPrice = currentValue.listing.price.amount;
        const currencyName = currentValue.listing.price.currency;
        if (!(currencyName in this.currencyPriceInChaos)) {
          return previousValue;
        }

        const newPrice = this.countPriceInChaos(
          previousValue,
          currentValueListingPrice,
          currencyName,
        );

        if (previousValue !== 0) {
          const timeListedChecked = this.timeListedChecked(
            currentValue.listing.indexed,
            24,
          );
          const diffCheck = this.differenceChecked(previousValue, newPrice);
          if (index > 3 && diffCheck && timeListedChecked) {
            return previousValue;
          }
        }
        return newPrice;
      },
      defaultInitialCount,
    );

    return resultValue;
  };

  // Перевірка різниці між попередньою та поточною ціною у відсотках
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

  getPricesInChaos = (
    itemsArray: PoeSecondResultType[],
    maxStackSize: number,
    priceMultiplier = 1,
  ) => {
    const itemPriceInChaos =
      this.calculatePriceInChaos(itemsArray) * priceMultiplier;

    const fullStackSizeInChaos =
      maxStackSize * itemPriceInChaos * priceMultiplier;

    return { itemPriceInChaos, fullStackSizeInChaos };
  };

  calculatePricesInAllCurrencies = (priceInChaos: number, maxStackSize = 1) => {
    const priceInAllCurrencies = new CurrencyData();
    for (const key in this.currencyPriceInChaos) {
      const decimalPlaces = key === 'chaos' ? 0 : 2;
      priceInAllCurrencies[key] = round(
        (priceInChaos * maxStackSize) / this.currencyPriceInChaos[key],
        decimalPlaces,
      );
    }
    return priceInAllCurrencies;
  };
}
