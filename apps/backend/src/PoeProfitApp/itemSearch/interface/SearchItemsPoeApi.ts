import type {
    PoeFirstResponseType,
    PoeSecondResponseType,
    RateLimitKeys,
    RequestBodyType,
} from "poe-trade-fetch";

export interface ISearchItemsPoeApi {
    leagueName: string;

    firsRequest: (
        _requestQuery: RequestBodyType,
    ) => Promise<PoeFirstResponseType>;
    httpRequest: {
        getWaitTime: (_key: RateLimitKeys) => number;
        delay: (_time?: number) => Promise<void>;
    };
    secondRequest: (
        _arrayIds: string[],
        _queryId: string,
    ) => Promise<PoeSecondResponseType>;
}
