import type {
    CURRENCY_OVERVIEW_TYPE_CATEGORY,
    ITEM_OVERVIEW_TYPE_CATEGORY,
} from "../NinjaApi.js";
import type {
    CurrencyNinjaResponseType,
    ItemNinjaResponseType,
} from "./NinjaResponseTypes.js";

export type NinjaAllDataType = {
    [K in OverviewCategory]: NinjaDataAnyItemsType<K>;
};

export type OverviewCategory =
    | ItemOverviewTypeCategory
    | CurrencyOverviewTypeCategory;
export type CurrencyOverviewTypeCategory =
    (typeof CURRENCY_OVERVIEW_TYPE_CATEGORY)[keyof typeof CURRENCY_OVERVIEW_TYPE_CATEGORY];
export type ItemOverviewTypeCategory =
    (typeof ITEM_OVERVIEW_TYPE_CATEGORY)[keyof typeof ITEM_OVERVIEW_TYPE_CATEGORY];

export type NinjaDataAnyItemsType<T extends OverviewCategory> =
    T extends CurrencyOverviewTypeCategory
        ? CurrencyNinjaResponseType
        : ItemNinjaResponseType;
