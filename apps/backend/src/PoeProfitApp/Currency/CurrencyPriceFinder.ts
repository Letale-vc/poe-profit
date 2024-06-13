import type { PoeTradeFetch } from "poe-trade-fetch";
import type { ExchangeResponseType } from "poe-trade-fetch/Types/ExchangeResponseType";
import type { TradeExchangeRequestType } from "poe-trade-fetch/Types/TradeExchangeRequestBodyType";
import logger from "../helpers/logger.js";
import { round } from "../helpers/utils.js";
import { CURRENCY, type CurrencyTypes } from "./currencyNames.js";

export default class CurrencyPriceFinder {
    static currencyPrice: Record<CurrencyTypes, number>;

    #lastUpdateTime;

    #poeApi: PoeTradeFetch;

    constructor(poeApi: PoeTradeFetch) {
        this.#poeApi = poeApi;

        this.#lastUpdateTime = new Date();
        this.#lastUpdateTime.setUTCHours(
            this.#lastUpdateTime.getUTCHours() - 1,
        );
        CurrencyPriceFinder.currencyPrice = CURRENCY.reduce(
            (acc, val) => {
                acc[val] = 1;
                return acc;
            },
            {} as Record<CurrencyTypes, number>,
        );
    }

    async #searchCurrencyInTrade(): Promise<
        Record<CurrencyTypes, ExchangeResponseType>
    > {
        try {
            const searchCurrencyResults = {} as Record<
                CurrencyTypes,
                ExchangeResponseType
            >;

            for (const key of CURRENCY) {
                if (key === "chaos") {
                    continue;
                }

                const bodyExchange: TradeExchangeRequestType = {
                    query: {
                        have: ["chaos"],
                        want: [key],
                        minimum: 5,
                    },
                };

                const result = await this.#poeApi.exchangeRequest(bodyExchange);
                searchCurrencyResults[key] = result;
            }
            return searchCurrencyResults;
        } catch (error) {
            logger.error(error);
            throw new Error("Error fetching currency prices");
        }
    }

    #currencyPriceCalculation(
        listingCurrInTrade: ExchangeResponseType,
    ): number {
        const keys = Object.keys(listingCurrInTrade.result);
        const index = Math.floor(keys.length * 0.4);
        const elementKey = keys[index];
        if (elementKey !== undefined) {
            const elementValue = listingCurrInTrade.result[elementKey];
            if (elementValue?.listing.offers[0]) {
                return round(
                    elementValue?.listing.offers[0].exchange.amount /
                        elementValue?.listing.offers[0].item.amount,
                    0,
                );
            }
        }
        return 1;
    }

    async update() {
        const oneHourAhead = new Date(this.#lastUpdateTime);
        oneHourAhead.setUTCHours(oneHourAhead.getUTCHours() + 1);
        if (new Date() < oneHourAhead) {
            logger.info("Currency SKIP update");
            return;
        }
        logger.info("Currency START update");
        const searchCurrencyResult = await this.#searchCurrencyInTrade();
        for (const key of CURRENCY) {
            if (!(key in searchCurrencyResult)) continue;
            const val = searchCurrencyResult[key];
            CurrencyPriceFinder.currencyPrice[key] =
                this.#currencyPriceCalculation(val);
        }
        this.#lastUpdateTime = new Date();
        logger.info("Currency END update");
    }
}
