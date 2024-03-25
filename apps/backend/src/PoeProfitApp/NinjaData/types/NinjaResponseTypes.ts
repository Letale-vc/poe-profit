export interface TransactionSampleType {
    id: number;
    league_id: number;
    pay_currency_id: number;
    get_currency_id: number;
    sample_time_utc: string;
    count: number;
    value: number;
    data_point_count: number;
    includes_secondary: boolean;
    listing_count: number;
}

export interface WeekOfDailyPriceChanges {
    data: (number | null | undefined)[];
    totalChange: number;
}

export interface CurrencyNinjaType {
    currencyTypeName: string;
    detailsId: string;
    pay?: TransactionSampleType;
    receive?: TransactionSampleType;
    paySparkLine: WeekOfDailyPriceChanges;
    receiveSparkLine: WeekOfDailyPriceChanges;
    chaosEquivalent: number;
    lowConfidencePaySparkLine: WeekOfDailyPriceChanges;
    lowConfidenceReceiveSparkLine: WeekOfDailyPriceChanges;
}

export interface CurrencyDetailType {
    id: number;
    icon: string;
    name: string;
    tradeId?: string;
}

export interface CurrencyNinjaResponseType {
    lines: CurrencyNinjaType[];
    currencyDetails: CurrencyDetailType[];
}

export interface ItemModifierType {
    text: string;
    optional: boolean;
}

export interface ItemNinjaType {
    id: number;
    name: string;
    icon?: string;
    levelRequired?: number;
    baseType: string;
    links?: number;
    itemClass: number;
    sparkline: WeekOfDailyPriceChanges;
    lowConfidenceSparkline: WeekOfDailyPriceChanges;
    implicitModifiers: ItemModifierType[];
    explicitModifiers: ItemModifierType[];
    flavourText?: string;
    itemType?: string;
    chaosValue: number;
    exaltedValue: number;
    stackSize?: number;
    divineValue: number;
    count: number;
    detailsId: string;
    tradeInfo: unknown[];
    listingCount: number;
}
export interface ItemNinjaResponseType {
    lines: ItemNinjaType[];
}
