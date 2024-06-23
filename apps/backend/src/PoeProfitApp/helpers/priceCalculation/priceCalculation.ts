import _ from "lodash";
import type { PoeSecondResultType } from "poe-trade-fetch";
import type { ExchangeResponseType } from "poe-trade-fetch/Types/ExchangeResponseType";
import type { CurrencyTypes } from "../../currency/currencyNames.js";
import CurrencyPriceFinder from "../../currency/currencyPriceFinder.js";

export function calculatePrice(
    itemsArray: PoeSecondResultType[],
    priceMultiplier = 1,
): { chaosValue: number; divineValue: number } {
    const chaosValue = calculatePriceInChaos(itemsArray) * priceMultiplier;
    const divineValue = chaosValue / CurrencyPriceFinder.currencyPrice.divine;
    return {
        chaosValue: _.round(chaosValue),
        divineValue: _.round(divineValue, 2),
    };
}

export function calculateExchangePrice(
    exchangeRes: ExchangeResponseType,
    priceMultiplier = 1,
) {
    const resultToArray = Object.values(exchangeRes.result);
    const currency = resultToArray[0].listing.offers[0].exchange
        .currency as CurrencyTypes;
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
        currency === "chaos"
            ? price
            : price * CurrencyPriceFinder.currencyPrice[currency];
    const divineValue =
        currency === "chaos"
            ? price / CurrencyPriceFinder.currencyPrice.divine
            : price;
    return {
        chaosValue: _.round(chaosValue),
        divineValue: _.round(divineValue, 2),
    };
}

function turnAnyPriceIntoChaos(value: number, currency: CurrencyTypes) {
    return value * CurrencyPriceFinder.currencyPrice[currency];
}

function countPriceInChaos(
    oldPrice: number,
    currentValueListingPrice: number,
    currencyName: CurrencyTypes,
): number {
    const howMuchToDivide = oldPrice === 0 ? 1 : 2;
    const convertInChaos = turnAnyPriceIntoChaos(
        currentValueListingPrice,
        currencyName,
    );
    const newPrice = (oldPrice + convertInChaos) / howMuchToDivide;

    return newPrice;
}

function calculatePriceInChaos(itemsArray: PoeSecondResultType[]): number {
    const resultValue = itemsArray.reduce(
        (previousValue, currentValue) => {
            const currentValueListingPrice = currentValue.listing.price.amount;

            const currency = currentValue.listing.price.currency;

            if (!(currency in CurrencyPriceFinder.currencyPrice)) {
                return previousValue;
            }

            const newPrice = countPriceInChaos(
                previousValue.price,
                currentValueListingPrice,
                currency as CurrencyTypes,
            );

            if (previousValue.price !== 0) {
                const diffCheck = differenceChecked(
                    previousValue.startPrice,
                    newPrice,
                );
                if (diffCheck) {
                    return previousValue;
                }
            }
            return {
                startPrice: previousValue.startPrice,
                price: newPrice,
            };
        },
        { price: 0, startPrice: 0 },
    );

    return resultValue.price;
}

function differenceChecked(startPrice: number, newPrice: number): boolean {
    const differenceToChaos = 10;
    const differenceInPercent = (newPrice / startPrice) * 100 - 100;
    const doesItExistBigDifferencePrice =
        differenceInPercent > differenceToChaos;

    return doesItExistBigDifferencePrice;
}
