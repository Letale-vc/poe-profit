import { CurrencyPriceEntity } from './entity/CurrencyPriceEntity';
import { round } from '../helpers/utils';
import { PoeSecondResultType } from '../types/response-poe-fetch';
import { PriceEntity } from './entity/PriceEntity';
import { IItemPriceCalculation } from '../item/interface/IItemPriceCalculation';

export class PriceCalculation implements IItemPriceCalculation {
  currencyPrice: CurrencyPriceEntity;

  constructor(
    private readonly divineListing: PoeSecondResultType[],
    private readonly exaltedListing: PoeSecondResultType[],
  ) {
    this.currencyPrice = this.getCurrencyPrice({
      divineListing: this.divineListing,
      exaltedListing: this.exaltedListing,
    });
  }
  // Значення для максимальної різниці у відсотках
  static readonly differenceToCurrency: Record<string, number> = {
    chaos: 10,
    divine: 2,
    exalted: 2,
  };

  // Перевірка часу, пройденого з моменту публікації оголошення на трейд сайті
  private timeListedChecked = (
    listingIndexedDate: Date,
    timeSkipInHours: number,
  ) => {
    // Обчислення часу, що пройшов в мілісекундах
    const timeSkipInMS = timeSkipInHours * 3.6e6;

    const timeInTrade = new Date(listingIndexedDate);
    const dateTimeNow = new Date();
    const timeListed = dateTimeNow.getTime() - timeInTrade.getTime();
    const timeListedChecked = timeListed > timeSkipInMS;
    return timeListedChecked;
  };

  // Перевірка різниці між попередньою та поточною ціною у відсотках
  private differenceChecked = (
    previousValue: PriceEntity,
    currentValue: PoeSecondResultType,
  ) => {
    const currencyName = currentValue.listing.price.currency;
    if (!PriceCalculation.differenceToCurrency[currencyName]) {
      return true;
    }
    const currentValueListingPrice = currentValue.listing.price.amount;

    const differenceInPercent =
      (currentValueListingPrice / previousValue[currencyName]) * 100 - 100;
    const doesItExistBigDifferencePrice =
      differenceInPercent > PriceCalculation.differenceToCurrency[currencyName];
    return doesItExistBigDifferencePrice;
  };

  // Розрахунок ціни предмета в залежності від валюти
  calculateItemPrice(
    previousValue: PriceEntity,
    currentValue: PoeSecondResultType,
    maxStackSize: number,
  ): PriceEntity {
    const currentValueListingPrice = currentValue.listing.price.amount;
    const currencyName = currentValue.listing.price.currency;

    let price = { ...previousValue };

    // Визначення валюти і виклик відповідної функції розрахунку ціни
    switch (currencyName) {
      case 'chaos':
        price = this.addItemPriceForChaos(
          price,
          previousValue,
          currentValueListingPrice,
          maxStackSize,
        );
        break;
      case 'divine':
        price = this.addItemPriceForDivine(
          price,
          previousValue,
          currentValueListingPrice,
          maxStackSize,
        );
        break;
      case 'exalted':
        price = this.addItemPriceForExalted(
          price,
          previousValue,
          currentValueListingPrice,
          maxStackSize,
        );
        break;
      default:
        return previousValue;
    }

    return price;
  }

  // Розрахунок ціни предмета для валюти Chaos
  private addItemPriceForChaos(
    price: PriceEntity,
    previousValue: { chaos: number; divine: number; exalted: number },
    currentValueListingPrice: number,
    maxStackSize: number,
  ): PriceEntity {
    const { chaos, divine, exalted } = previousValue;
    const howMuchToDivide = chaos === 0 ? 1 : 2;

    const updatedPrice = { ...price };
    updatedPrice.chaos = (chaos + currentValueListingPrice) / howMuchToDivide;
    const convertChaosInDivine =
      currentValueListingPrice / this.currencyPrice.divinePriceInChaos;
    updatedPrice.divine = (divine + convertChaosInDivine) / howMuchToDivide;
    const convertChaosInExalted =
      currentValueListingPrice / this.currencyPrice.exaltedPriceInChaos;
    updatedPrice.exalted = (exalted + convertChaosInExalted) / howMuchToDivide;
    updatedPrice.priceInChaosIfFullStackSize =
      maxStackSize * updatedPrice.chaos;
    updatedPrice.priceInExaltedIfFullStackSize =
      maxStackSize * updatedPrice.exalted;
    updatedPrice.priceInDivineIfFullStackSize =
      maxStackSize * updatedPrice.divine;

    return updatedPrice;
  }

  // Розрахунок ціни предмета для валюти Divine
  private addItemPriceForDivine(
    price: PriceEntity,
    previousValue: { chaos: number; divine: number; exalted: number },
    currentValueListingPrice: number,
    maxStackSize: number,
  ): PriceEntity {
    const { chaos, divine, exalted } = previousValue;
    const howMuchToDivide = chaos === 0 ? 1 : 2;

    const updatedPrice = { ...price };
    const convertDivineInChaos =
      currentValueListingPrice * this.currencyPrice.divinePriceInChaos;
    const convertDivineInExalted =
      convertDivineInChaos / this.currencyPrice.exaltedPriceInChaos;

    updatedPrice.chaos = (chaos + convertDivineInChaos) / howMuchToDivide;
    updatedPrice.divine = (divine + currentValueListingPrice) / howMuchToDivide;
    updatedPrice.exalted = (exalted + convertDivineInExalted) / howMuchToDivide;
    updatedPrice.priceInChaosIfFullStackSize =
      maxStackSize * updatedPrice.chaos;
    updatedPrice.priceInDivineIfFullStackSize =
      maxStackSize * updatedPrice.divine;
    updatedPrice.priceInExaltedIfFullStackSize =
      maxStackSize * updatedPrice.exalted;

    return updatedPrice;
  }

  // Розрахунок ціни предмета для валюти Exalted
  private addItemPriceForExalted(
    price: PriceEntity,
    previousValue: { chaos: number; divine: number; exalted: number },
    currentValueListingPrice: number,
    maxStackSize: number,
  ): PriceEntity {
    const { chaos, divine, exalted } = previousValue;
    const howMuchToDivide = chaos === 0 ? 1 : 2;

    const updatedPrice = { ...price };
    const convertExaltedInChaos =
      currentValueListingPrice * this.currencyPrice.exaltedPriceInChaos;
    const convertExaltedInDivine =
      convertExaltedInChaos / this.currencyPrice.divinePriceInChaos;

    updatedPrice.chaos = (chaos + convertExaltedInChaos) / howMuchToDivide;
    updatedPrice.divine = (divine + convertExaltedInDivine) / howMuchToDivide;
    updatedPrice.exalted =
      (exalted + currentValueListingPrice) / howMuchToDivide;
    updatedPrice.priceInChaosIfFullStackSize =
      maxStackSize * updatedPrice.chaos;
    updatedPrice.priceInDivineIfFullStackSize =
      maxStackSize * updatedPrice.divine;
    updatedPrice.priceInExaltedIfFullStackSize =
      maxStackSize * updatedPrice.exalted;

    return updatedPrice;
  }

  private itemPriceCalculation = (
    itemsArray: PoeSecondResultType[],
    total: number,
    maxStackSize: number,
  ) => {
    const defaultInitialCount = PriceEntity.createDefault();

    const resultValue = itemsArray.reduce(
      (previousValue, currentValue, index) => {
        const timeSkipInHoursForTotalGreaterThan50 = 5;
        const timeSkipInHoursForTotalLessThanOrEqualTo50 = 24;
        const maxItemsToSkipForTotalGreaterThan50 = 4;
        const maxItemsToSkipForTotalLessThanOrEqualTo50 = 2;
        if (total > 50) {
          const timeListedChecked = this.timeListedChecked(
            currentValue.listing.indexed,
            timeSkipInHoursForTotalGreaterThan50,
          );
          if (
            index < maxItemsToSkipForTotalGreaterThan50 &&
            timeListedChecked
          ) {
            return previousValue;
          }
        } else {
          const timeListedChecked = this.timeListedChecked(
            currentValue.listing.indexed,
            timeSkipInHoursForTotalLessThanOrEqualTo50,
          );
          if (
            index < maxItemsToSkipForTotalLessThanOrEqualTo50 &&
            timeListedChecked
          ) {
            return previousValue;
          }
        }
        if (previousValue.chaos !== 0) {
          const diffCheck = this.differenceChecked(previousValue, currentValue);
          if (index > 3 && diffCheck) {
            return previousValue;
          }
        }

        const countPrice = this.calculateItemPrice(
          previousValue,
          currentValue,
          maxStackSize,
        );
        return countPrice;
      },
      defaultInitialCount,
    );

    return resultValue;
  };

  getItemPrice = (
    itemsArray: PoeSecondResultType[],
    total: number,
    maxStackSize: number,
    priceMultiplier = 1,
  ) => {
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
  };

  private currencyPriceCalculation = (
    listingCurrencyInTrade: PoeSecondResultType[],
  ) => {
    const countAllListingPrice = listingCurrencyInTrade.reduce((acc, value) => {
      return value.listing.price.amount + acc;
    }, 0);
    const currencyPriceRound = round(
      countAllListingPrice / listingCurrencyInTrade.length,
      0,
    );
    return currencyPriceRound;
  };

  // Отримання курсу обміну валютами Divine і Exalted у Chaos
  private getCurrencyPrice = ({
    divineListing,
    exaltedListing,
  }: {
    divineListing: PoeSecondResultType[];
    exaltedListing: PoeSecondResultType[];
  }) => {
    const currencyPrice = new CurrencyPriceEntity();
    currencyPrice.divinePriceInChaos =
      this.currencyPriceCalculation(divineListing);
    currencyPrice.exaltedPriceInChaos =
      this.currencyPriceCalculation(exaltedListing);

    return currencyPrice;
  };
}
