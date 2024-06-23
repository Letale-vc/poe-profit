import type { AxiosRequestConfig } from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";
import type {
    PoeSecondResultType,
    PoeTradeFetch,
    RequestBodyType,
} from "poe-trade-fetch";
import type { ExchangeResponseType } from "poe-trade-fetch/Types/ExchangeResponseType";
import type { TradeExchangeRequestType } from "poe-trade-fetch/Types/TradeExchangeRequestBodyType";
import { Logger } from "../helpers/logger.js";
import { handleError } from "../helpers/utils.js";

export interface ItemSearchResult {
    result: PoeSecondResultType[];
    id: string;
    total: number;
}

export class ItemSearcher {
    #axiosOptions: AxiosRequestConfig = {};
    #agent: HttpsProxyAgent<string> | undefined;
    #poeTradeFetch: PoeTradeFetch;
    #proxy: string | undefined;
    constructor(poeTradeFetch: PoeTradeFetch) {
        this.#poeTradeFetch = poeTradeFetch;
        this.#proxy = process.env.PROXY ?? undefined;

        if (this.#proxy && this.#agent === undefined) {
            Logger.info(`Set proxy: ${this.#proxy}`);
            this.#agent = new HttpsProxyAgent(`http://${this.#proxy}`);
            this.#axiosOptions = Object.freeze({ httpsAgent: this.#agent });
            Logger.info(`Set proxy agent: ${this.#proxy}`);
        }
    }

    getTradeLink(requestQuery: RequestBodyType): string {
        const tradeLink = new URL(
            `https://www.pathofexile.com/trade/search/${this.#poeTradeFetch.leagueName}`,
        );
        tradeLink.searchParams.append("q", JSON.stringify(requestQuery));
        return tradeLink.toString();
    }

    async fetchItemDetails(
        requestQuery: RequestBodyType,
        skip = 2,
        take = 3,
    ): Promise<ItemSearchResult | undefined> {
        try {
            const firstResponse = await this.#poeTradeFetch.firsRequest(
                requestQuery,
                this.#axiosOptions,
            );
            const { id, result, total } = firstResponse;

            if (total === 0) return { result: [], id, total };

            const howManyItemsToSkip =
                total > skip || total > skip * 2 + take ? skip : 0;
            const howMuchToTakeFromTheResult = take + skip;
            const totalTakeResultArray = result.slice(
                howManyItemsToSkip,
                howMuchToTakeFromTheResult,
            );
            const secondResponse = await this.#poeTradeFetch.secondRequest(
                totalTakeResultArray,
                id,
                this.#axiosOptions,
            );
            return { result: secondResponse.result, id, total };
        } catch (error) {
            return handleError(error);
        }
    }

    async fetchExchangeData(
        query: TradeExchangeRequestType,
    ): Promise<ExchangeResponseType | undefined> {
        try {
            const res = await this.#poeTradeFetch.exchangeRequest(query);
            return res;
        } catch (error) {
            return handleError(error);
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
