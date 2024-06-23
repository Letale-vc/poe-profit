import type { PoeTradeFetch } from "poe-trade-fetch";
import type { ExchangeResponseType } from "poe-trade-fetch/Types/ExchangeResponseType";
import type { TradeExchangeRequestType } from "poe-trade-fetch/Types/TradeExchangeRequestBodyType";
import { PoeTradeFetchError } from "poe-trade-fetch/poeTradeFetchError";
import { Logger } from "../helpers/logger.js";
import { STATUS_CODE, handleError, round } from "../helpers/utils.js";
import { CURRENCY, type CurrencyTypes } from "./currencyNames.js";

export default class CurrencyPriceFinder {
    static currencyPrice: Record<CurrencyTypes, number>;

    #lastUpdateTime;

    #poeTradeFetch: PoeTradeFetch;

    constructor(poeApi: PoeTradeFetch) {
        this.#poeTradeFetch = poeApi;

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
        Record<CurrencyTypes, ExchangeResponseType> | undefined
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

                const result =
                    await this.#poeTradeFetch.exchangeRequest(bodyExchange);
                searchCurrencyResults[key] = result;
            }
            return searchCurrencyResults;
        } catch (error) {
            return handleError(error);
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

    async update(): Promise<STATUS_CODE> {
        try {
            const oneHourAhead = new Date(this.#lastUpdateTime);
            oneHourAhead.setUTCHours(oneHourAhead.getUTCHours() + 1);

            if (new Date() < oneHourAhead) {
                Logger.info("Currency SKIP update");
                return STATUS_CODE.OK;
            }

            Logger.info("Currency START update");
            const searchCurrencyResult = await this.#searchCurrencyInTrade();

            if (searchCurrencyResult === undefined) {
                return STATUS_CODE.UNKNOWN_ERROR;
            }

            for (const key of CURRENCY) {
                if (!(key in searchCurrencyResult)) continue;
                const val = searchCurrencyResult[key];
                CurrencyPriceFinder.currencyPrice[key] =
                    this.#currencyPriceCalculation(val);
            }

            this.#lastUpdateTime = new Date();
            Logger.info("Currency END update");

            return STATUS_CODE.OK;
        } catch (error) {
            if (error instanceof PoeTradeFetchError) {
                return STATUS_CODE.TRADE_LIMIT;
            }
            return STATUS_CODE.UNKNOWN_ERROR;
        }
    }
}
