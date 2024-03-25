import { isAxiosError, type AxiosRequestConfig } from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";
import type { PoeSecondResultType, PoeTradeFetch, RequestBodyType } from "poe-trade-fetch";
import type { ExchangeResponseType } from "poe-trade-fetch/Types/ExchangeResponseType";
import type { TradeExchangeRequestType } from "poe-trade-fetch/Types/TradeExchangeRequestBodyType";
import logger from "../Helpers/Logger.js";

export interface ItemSearchResultType {
    result: PoeSecondResultType[];
    id: string;
    total: number;
}

export class ItemSearcher {
    static #axiosOptions: AxiosRequestConfig = {};
    static #agent: HttpsProxyAgent<string> | undefined;
    #poeApi;
    #proxy: string | undefined;
    constructor(poeApi: PoeTradeFetch) {
        this.#poeApi = poeApi;
        this.#proxy = process.env.PROXY ?? undefined;
        if (this.#proxy && ItemSearcher.#agent === undefined) {
            logger.info(`Set proxy: ${this.#proxy}`);
            ItemSearcher.#agent = new HttpsProxyAgent(`http://${this.#proxy}`);
            ItemSearcher.#axiosOptions = { httpsAgent: ItemSearcher.#agent };
            logger.info(`Set proxy agent: ${this.#proxy}`);
        }
    }

    async fetchItemData(
        requestQuery: RequestBodyType,
        skip = 2,
        take = 3,
    ): Promise<ItemSearchResultType | undefined> {
        try {
            const firstResponse = await this.#poeApi.firsRequest(
                requestQuery,
                ItemSearcher.#axiosOptions,
            );
            const { id, result, total } = firstResponse;

            if (total === 0) return { result: [], id, total };

            // const howManyItemsToSkipInTheList =
            //     this.howManyItemsToSkipInTheList(total);
            const howManyItemsToSkip = total > skip || total > skip * 2 + take ? skip : 0;
            const howMuchToTakeFromTheResult = take + skip;
            const totalTakeResultArray = result.slice(
                howManyItemsToSkip,
                howMuchToTakeFromTheResult,
            );
            const secondResponse = await this.#poeApi.secondRequest(
                totalTakeResultArray,
                id,
                ItemSearcher.#axiosOptions,
            );
            return { result: secondResponse.result, id, total };
        } catch (e) {
            if (
                isAxiosError<{
                    error: {
                        code: number;
                        message: string;
                    };
                }>(e)
            ) {
                if (e.response?.status === 429) {
                    logger.error(e);
                    throw e;
                } else {
                    logger.error(e);
                }
            } else {
                logger.error(e);
            }
            return undefined;
        }
    }

    async fetchExchangeData(
        query: TradeExchangeRequestType,
    ): Promise<ExchangeResponseType | undefined> {
        try {
            const res = await this.#poeApi.exchangeRequest(query);
            return res;
        } catch (e) {
            if (
                isAxiosError<{
                    error: {
                        code: number;
                        message: string;
                    };
                }>(e)
            ) {
                if (e.response?.status === 429) {
                    logger.error(e.response?.data.error.message);
                    throw e;
                } else {
                    logger.error(e.request, e.response?.data.error.message);
                }
            } else {
                logger.error(e);
            }
            return undefined;
        }
    }

    #howManyItemsToSkipInTheList(totalList: number) {
        switch (true) {
            case totalList > 50 && totalList < 100:
                return 3;
            case totalList > 100:
                return 5;
            default:
                return 0;
        }
    }
}
