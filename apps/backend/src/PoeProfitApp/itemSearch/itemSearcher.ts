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
    private _axiosOptions: AxiosRequestConfig = {};
    private _agent: HttpsProxyAgent<string> | undefined;
    private _poeTradeFetch: PoeTradeFetch;
    private _proxy: string | undefined;

    constructor(poeTradeFetch: PoeTradeFetch) {
        this._poeTradeFetch = poeTradeFetch;
        this._proxy = process.env.PROXY ?? undefined;

        if (this._proxy && this._agent === undefined) {
            Logger.info(`Set proxy: ${this._proxy}`);
            this._agent = new HttpsProxyAgent(`http://${this._proxy}`);
            this._axiosOptions = Object.freeze({ httpsAgent: this._agent });
            Logger.info(`Set proxy agent: ${this._proxy}`);
        }
    }

    getTradeLink(requestQuery: RequestBodyType): string {
        const tradeLink = new URL(
            `https://www.pathofexile.com/trade/search/${this._poeTradeFetch.leagueName}`,
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
            const firstResponse = await this._poeTradeFetch.firsRequest(
                requestQuery,
                this._axiosOptions,
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
            const secondResponse = await this._poeTradeFetch.secondRequest(
                totalTakeResultArray,
                id,
                this._axiosOptions,
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
            const res = await this._poeTradeFetch.exchangeRequest(query);
            return res;
        } catch (error) {
            return handleError(error);
        }
    }
}
