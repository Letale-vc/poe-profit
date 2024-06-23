import { PoeTradeFetchError } from "poe-trade-fetch/poeTradeFetchError";
import { Logger } from "./logger.js";

export const round = (num: number, decimalPlaces = 0): number => {
    const p = 10 ** decimalPlaces;
    const n = num * p * (1 + Number.EPSILON);
    return Math.round(n) / p;
};

export function handleError(error: unknown): undefined {
    if (error instanceof PoeTradeFetchError) {
        Logger.error(error.message);
        if (error.poeTradeApiErrorCode === 3) {
            throw error;
        }
    } else if (error instanceof Error) {
        Logger.error(error.message);
    } else {
        Logger.error("Unknown error.");
        throw new Error("Unknown error.");
    }
    return undefined;
}

// export const STATUS_CODE = Object.freeze({
//     OK: 0,
//     TRADE_LIMIT: 1,
//     UNKNOWN_ERROR: 2,
// });

// export type StatusCode = (typeof STATUS_CODE)[keyof typeof STATUS_CODE];

export enum STATUS_CODE {
    OK = 0,
    TRADE_LIMIT = 1,
    UNKNOWN_ERROR = 2,
}
