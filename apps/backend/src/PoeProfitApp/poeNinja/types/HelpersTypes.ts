import type { CURRENCY_CATEGORY, ITEM_CATEGORY } from "../poeNinjaApi.js";
import type {
    PoeNinjaCurrencyResponseType,
    PoeNinjaItemResponseType,
} from "./PoeNinjaResponseTypes.js";

export type PoeNinjaDataType = {
    [K in CategoryType]: CategoryDataType<K>;
};

export type CategoryType = ItemCategoryType | CurrencyCategoryType;
export type CurrencyCategoryType =
    (typeof CURRENCY_CATEGORY)[keyof typeof CURRENCY_CATEGORY];
export type ItemCategoryType =
    (typeof ITEM_CATEGORY)[keyof typeof ITEM_CATEGORY];

export type CategoryDataType<T extends CategoryType> =
    T extends CurrencyCategoryType
        ? PoeNinjaCurrencyResponseType
        : PoeNinjaItemResponseType;
