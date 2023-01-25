export interface FlipItemTypes {
  itemBuyingInfo: ItemInfoType;
  itemSellingInfo: ItemInfoType;
  profitInDivine: number;
  profitInDivinePerTrade: number;
  profitInChaos: number;
  profitInChaosPerTrade: number;
  queriesFlipUuid: string;
}

export interface ItemInfoType {
  poeTradeLink: string;
  price: {
    [key: string]: number;
    chaos: number;
    divine: number;
    exalted: number;
    priceInChaosIfFullStackSize: number;
    priceInDivineIfFullStackSize: number;
    priceInExaltedIfFullStackSize: number;
  };
  name: string;
  maxStackSize: number;
  totalInTrade: number;
  quality?: number;
}

export interface PoeFlipDataType {
  flipData: FlipItemTypes[];
  lastUpdate: Date;
}
