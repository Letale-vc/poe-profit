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
