import { CurrencyPriceEntity } from './entity/CurrencyPriceEntity';
import { round } from '../helpers/utils';
import { PoeSecondResult } from '../types/response-poe-fetch';
import { PriceEntity } from './entity/PriceEntity';
import { IItemPriceCalculation } from '../item/interface/IItemPriceCalculation';

export class PriceCalculation implements IItemPriceCalculation {
  currencyPrice: CurrencyPriceEntity;

  constructor(
    private readonly divineListing: PoeSecondResult[],
    private readonly exaltedListing: PoeSecondResult[],
  ) {
    this.currencyPrice = this.getCurrencyPrice({
      divineListing: this.divineListing,
      exaltedListing: this.exaltedListing,
    });
  }

  private timeListedChecked(listingIndexedDate: Date) {
    const timeInTrade = new Date(listingIndexedDate);
    const dateTimeNow = new Date();
    const timeListed = dateTimeNow.getTime() - timeInTrade.getTime();
    const timeListedChecked = timeListed > 1.8e7;
    return timeListedChecked;
  }

  private differenceChecked(
    previousValue: PriceEntity,
    currentValue: PoeSecondResult,
  ) {
    const differenceToCurrency: { [key: string]: number } = {
      chaos: 10,
      divine: 2,
      exalted: 2,
    };
    const currencyName = currentValue.listing.price.currency;
    if (!differenceToCurrency[currencyName]) {
      return true;
    }
    const currentValueListingPrice = currentValue.listing.price.amount;

    const differenceInPercent =
      (currentValueListingPrice / previousValue[currencyName]) * 100 - 100;
    const doesItExistBigDifferencePrice =
      differenceInPercent > differenceToCurrency[currencyName];
    return doesItExistBigDifferencePrice;
  }

  private addItemPriceToCalculation(
    previousValue: PriceEntity,
    currentValue: PoeSecondResult,
    maxStackSize: number,
  ) {
    const { chaos, divine, exalted } = previousValue;
    const howMuchToDivide = chaos === 0 ? 1 : 2;
    const currentValueListingPrice = currentValue.listing.price.amount;
    const currencyName = currentValue.listing.price.currency;

    const price = new PriceEntity();

    switch (currencyName) {
      case 'chaos': {
        price.chaos = (chaos + currentValueListingPrice) / howMuchToDivide;
        const convertChaosInDivine =
          currentValueListingPrice / this.currencyPrice.divinePriceInChaos;
        price.divine = (divine + convertChaosInDivine) / howMuchToDivide;
        const convertChaosInExalted =
          currentValueListingPrice / this.currencyPrice.exaltedPriceInChaos;
        price.exalted = (exalted + convertChaosInExalted) / howMuchToDivide;
        price.priceInChaosIfFullStackSize = maxStackSize * price.chaos;
        price.priceInExaltedIfFullStackSize = maxStackSize * price.exalted;
        price.priceInDivineIfFullStackSize = maxStackSize * price.divine;

        return price;
      }
      case 'divine': {
        const convertDivineInChaos =
          currentValueListingPrice * this.currencyPrice.divinePriceInChaos;

        const convertDivineInExalted =
          convertDivineInChaos / this.currencyPrice.exaltedPriceInChaos;

        price.chaos = (chaos + convertDivineInChaos) / howMuchToDivide;
        price.divine = (divine + currentValueListingPrice) / howMuchToDivide;
        price.exalted = (exalted + convertDivineInExalted) / howMuchToDivide;
        price.priceInChaosIfFullStackSize = maxStackSize * price.chaos;
        price.priceInDivineIfFullStackSize = maxStackSize * price.divine;
        price.priceInExaltedIfFullStackSize = maxStackSize * price.exalted;

        return price;
      }
      case 'exalted': {
        const convertExaltedInChaos =
          currentValueListingPrice * this.currencyPrice.exaltedPriceInChaos;
        const convertExaltedInDivine =
          convertExaltedInChaos / this.currencyPrice.divinePriceInChaos;

        price.chaos = (chaos + convertExaltedInChaos) / howMuchToDivide;
        price.divine = (divine + convertExaltedInDivine) / howMuchToDivide;
        price.exalted = (exalted + currentValueListingPrice) / howMuchToDivide;
        price.priceInChaosIfFullStackSize = maxStackSize * price.chaos;
        price.priceInDivineIfFullStackSize = maxStackSize * price.divine;
        price.priceInExaltedIfFullStackSize = maxStackSize * price.exalted;

        return price;
      }
      default: {
        return previousValue;
      }
    }
  }

  private itemPriceCalculation(
    itemsArray: PoeSecondResult[],
    total: number,
    maxStackSize: number,
  ) {
    const defaultInitialCount = new PriceEntity();

    defaultInitialCount.chaos = 0;
    defaultInitialCount.divine = 0;
    defaultInitialCount.exalted = 0;
    defaultInitialCount.priceInChaosIfFullStackSize = 0;
    defaultInitialCount.priceInDivineIfFullStackSize = 0;
    defaultInitialCount.priceInExaltedIfFullStackSize = 0;

    const resultValue = itemsArray.reduce(
      (previousValue, currentValue, index) => {
        if (total > 50) {
          const timeListedChecked = this.timeListedChecked(
            currentValue.listing.indexed,
          );
          if (index < 4 && timeListedChecked) {
            return previousValue;
          }
        }
        if (previousValue.chaos !== 0) {
          const diffCheck = this.differenceChecked(previousValue, currentValue);
          if (index > 3 && diffCheck) {
            return previousValue;
          }
        }

        const countPrice = this.addItemPriceToCalculation(
          previousValue,
          currentValue,
          maxStackSize,
        );
        return countPrice;
      },
      defaultInitialCount,
    );

    return resultValue;
  }

  getItemPrice(
    itemsArray: PoeSecondResult[],
    total: number,
    maxStackSize: number,
    priceMultiplier = 1,
  ) {
    const itemPrice = this.itemPriceCalculation(
      itemsArray,
      total,
      maxStackSize,
    );
    const price = new PriceEntity();
    price.chaos = round(itemPrice.chaos * priceMultiplier);
    price.divine = round(itemPrice.divine * priceMultiplier, 2);
    price.exalted = round(itemPrice.exalted * priceMultiplier, 2);
    price.priceInChaosIfFullStackSize = round(
      itemPrice.priceInChaosIfFullStackSize,
    );
    price.priceInExaltedIfFullStackSize = round(
      itemPrice.priceInExaltedIfFullStackSize,
      2,
    );
    price.priceInDivineIfFullStackSize = round(
      itemPrice.priceInDivineIfFullStackSize,
      2,
    );

    return price;
  }

  private currencyPriceCalculation(listingCurrencyInTrade: PoeSecondResult[]) {
    const countAllListingPrice = listingCurrencyInTrade.reduce((acc, value) => {
      return value.listing.price.amount + acc;
    }, 0);
    const currencyPriceRound = round(
      countAllListingPrice / listingCurrencyInTrade.length,
      0,
    );
    return currencyPriceRound;
  }

  private getCurrencyPrice(arg: {
    divineListing: PoeSecondResult[];
    exaltedListing: PoeSecondResult[];
  }) {
    const { divineListing, exaltedListing } = arg;
    const currencyPrice = new CurrencyPriceEntity();
    currencyPrice.divinePriceInChaos =
      this.currencyPriceCalculation(divineListing);
    currencyPrice.exaltedPriceInChaos =
      this.currencyPriceCalculation(exaltedListing);

    return currencyPrice;
  }
}
