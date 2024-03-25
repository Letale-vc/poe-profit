import type { RequestBodyType } from "poe-trade-fetch";

export interface GemItemType {
    tradeLink: string;
    icon?: string;
    name: string;
    listings: number;
    divineValue: number;
    chaosValue: number;
}

export interface GemsExpProfit {
    id: string;
    itemBuying: GemItemType;
    itemSelling: GemItemType;
    profitInDivine: number;
    profitInChaos: number;
}

export interface RequestGemList {
    gem: string;
    itemBuying: RequestBodyType;
    itemSelling: RequestBodyType;
}
