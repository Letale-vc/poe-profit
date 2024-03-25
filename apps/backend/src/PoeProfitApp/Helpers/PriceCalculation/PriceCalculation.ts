import _ from "lodash";
import type { PoeSecondResultType } from "poe-trade-fetch";
import type { ExchangeResponseType } from "poe-trade-fetch/Types/ExchangeResponseType";
import { type CurrencyType } from "../../Currency/CurrencyNames.js";
import CurrencyPriceFinder from "../../Currency/CurrencyPriceFinder.js";

export class ItemPriceCalculation {
    static #instance: ItemPriceCalculation;

    constructor() {
        if (ItemPriceCalculation.#instance) {
            return ItemPriceCalculation.#instance;
        }

        ItemPriceCalculation.#instance = this;
    }
    static calculatePrice(
        itemsArray: PoeSecondResultType[],
        priceMultiplier = 1,
    ): { chaosValue: number; divineValue: number } {
        const chaosValue = this.#calculatePriceInChaos(itemsArray) * priceMultiplier;
        const divineValue = chaosValue / CurrencyPriceFinder.currencyPrice.divine;
        return {
            chaosValue: _.round(chaosValue),
            divineValue: _.round(divineValue, 2),
        };
    }

    static calculateExchangePrice(exchangeRes: ExchangeResponseType, priceMultiplier = 1) {
        const resultToArray = Object.values(exchangeRes.result);
        const currency = resultToArray[0].listing.offers[0].exchange.currency as CurrencyType;
        const limitTakeListing =
            currency === "chaos"
                ? exchangeRes.total < 10
                    ? exchangeRes.total - 1
                    : 10
                : exchangeRes.total < 3
                  ? exchangeRes.total - 1
                  : 3;
        const skip = currency === "chaos" ? (exchangeRes.total < 3 ? 0 : 3) : 0;

        const price =
            resultToArray.slice(skip, limitTakeListing).reduce((acc, val) => {
                const exchangeAmount = val.listing.offers[0].exchange.amount;
                const itemAmount = val.listing.offers[0].item.amount;
                const howMuchToDivide = acc === 0 ? 1 : 2;
                return (exchangeAmount / itemAmount + acc) / howMuchToDivide;
            }, 0) * priceMultiplier;
        const chaosValue =
            currency === "chaos" ? price : price * CurrencyPriceFinder.currencyPrice[currency];
        const divineValue =
            currency === "chaos" ? price / CurrencyPriceFinder.currencyPrice.divine : price;
        return {
            chaosValue: _.round(chaosValue),
            divineValue: _.round(divineValue, 2),
        };
    }

    static #turnAnyPriceIntoChaos = (value: number, currency: CurrencyType) => {
        return value * CurrencyPriceFinder.currencyPrice[currency];
    };

    static #countPriceInChaos = (
        oldPrice: number,
        currentValueListingPrice: number,
        currencyName: CurrencyType,
    ): number => {
        const howMuchToDivide = oldPrice === 0 ? 1 : 2;
        const convertInChaos = this.#turnAnyPriceIntoChaos(currentValueListingPrice, currencyName);
        const newPrice = (oldPrice + convertInChaos) / howMuchToDivide;

        return newPrice;
    };

    static #calculatePriceInChaos(itemsArray: PoeSecondResultType[]): number {
        const resultValue = itemsArray.reduce(
            (previousValue, currentValue) => {
                const currentValueListingPrice = currentValue.listing.price.amount;

                const currency = currentValue.listing.price.currency;

                if (!(currency in CurrencyPriceFinder.currencyPrice)) {
                    return previousValue;
                }

                const newPrice = this.#countPriceInChaos(
                    previousValue.price,
                    currentValueListingPrice,
                    currency as CurrencyType,
                );

                if (previousValue.price !== 0) {
                    const diffCheck = this.#differenceChecked(previousValue.startPrice, newPrice);
                    if (diffCheck) {
                        return previousValue;
                    }
                }
                return {
                    ...previousValue,
                    price: newPrice,
                };
            },
            { price: 0, startPrice: 0 },
        );

        return resultValue.price;
    }

    static #differenceChecked = (startPrice: number, newPrice: number): boolean => {
        const differenceToChaos = 10;
        const differenceInPercent = (newPrice / startPrice) * 100 - 100;
        const doesItExistBigDifferencePrice = differenceInPercent > differenceToChaos;

        return doesItExistBigDifferencePrice;
    };

    // #timeListedChecked = (
    //     listingIndexedDate: Date,
    //     timeSkipInHours: number,
    // ) => {
    //     // Calculating the time that has passed in milliseconds
    //     const timeSkipInMS = timeSkipInHours * 3.6e6;
    //     const timeInTrade = new Date(listingIndexedDate);
    //     const dateTimeNow = new Date();
    //     const timeListed = dateTimeNow.getTime() - timeInTrade.getTime();
    //     const timeListedChecked = timeListed > timeSkipInMS;
    //     return timeListedChecked;
    // };

    // getPricesInChaos(
    //     itemsArray: PoeSecondResultType[],
    //     maxStackSize: number,
    //     priceMultiplier = 1,
    // ) {
    //     const itemPriceInChaos =
    //         this.#calculatePriceInChaos(itemsArray) * priceMultiplier;
    //     const fullStackSizeInChaos =
    //         maxStackSize * itemPriceInChaos * priceMultiplier;
    //     return { itemPriceInChaos, fullStackSizeInChaos };
    // }

    // calculatePricesInAllCurrencies(
    //     priceInChaos: number,
    //     maxStackSize = 1,
    // ): Record<string, number> {
    //     const priceInAllCurrencies = new Map<string, number>();
    //     for (const [key, val] of this.currencyPriceInChaos.entries()) {
    //         const decimalPlaces = key === "chaos" ? 0 : 2;
    //         priceInAllCurrencies.set(
    //             key,
    //             // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    //             _.round((priceInChaos * maxStackSize) / val, decimalPlaces),
    //         );
    //     }
    //     return Object.fromEntries(priceInAllCurrencies);
    // }
}
