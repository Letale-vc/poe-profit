export interface ItemType {
    tradeLink: string;
    icon?: string;
    name: string;
    stackSize: number;
    listings: number;
    divineValue: number;
    chaosValue: number;
}

export interface DivProfitObject {
    id: string;
    itemBuying: ItemType;
    itemSelling: ItemType;
    profitPerTradeInChaos: number;
    profitPerTradeInDivine: number;
    profitInDivine: number;
    profitInChaos: number;
}

export interface GemItemType {
    tradeLink: string;
    icon?: string;
    name: string;
    listings: number;
    divineValue: number;
    chaosValue: number;
}
export type DataType = Record<
    string,
    Record<string, DivProfitObject | GemsExpProfit>
>;

export interface GemsExpProfit {
    id: string;
    itemBuying: GemItemType;
    itemSelling: GemItemType;
    profitInDivine: number;
    profitInChaos: number;
}
