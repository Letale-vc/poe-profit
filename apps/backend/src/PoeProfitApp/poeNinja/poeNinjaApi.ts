import axios, { type AxiosInstance } from "axios";
import type {
    CurrencyCategoryType,
    ItemCategoryType,
    PoeNinjaDataType,
} from "./types/HelpersTypes.js";
import type {
    PoeNinjaCurrencyResponseType,
    PoeNinjaItemResponseType,
} from "./types/PoeNinjaResponseTypes.js";

export class PoeNinjaApi {
    #baseURL = new URL("https://poe.ninja/api");

    private _axiosInstance: AxiosInstance;

    constructor() {
        this._axiosInstance = axios.create({
            baseURL: this.#baseURL.toString(),
        });
    }

    async getAllNinjaData(leagueName: string): Promise<PoeNinjaDataType> {
        const currencyPromises = Object.values(CURRENCY_CATEGORY).map(
            async (category) => {
                const response = await this._getCurrencyOverview(
                    leagueName,
                    category,
                );

                return { [category]: response };
            },
        );

        const itemPromises = Object.values(ITEM_CATEGORY).map(
            async (category) => {
                const response = await this._getItemOverview(
                    leagueName,
                    category,
                );
                return { [category]: response };
            },
        );

        const currencyResponses = (await Promise.allSettled(currencyPromises))
            .filter((x) => x.status === "fulfilled")
            .map(
                (x) =>
                    (
                        x as PromiseFulfilledResult<
                            Record<
                                CurrencyCategoryType,
                                PoeNinjaCurrencyResponseType
                            >
                        >
                    ).value,
            );

        const itemResponses = (
            (await Promise.allSettled(itemPromises)).filter(
                (x) => x.status === "fulfilled",
            ) as PromiseFulfilledResult<
                Record<ItemCategoryType, PoeNinjaItemResponseType>
            >[]
        ).map((x) => x.value);

        const currencyCategory = Object.assign({}, ...currencyResponses);

        const itemCategory = Object.assign({}, ...itemResponses);
        const ninjaData = Object.assign(currencyCategory, itemCategory);

        return ninjaData;
    }

    private async _getCurrencyOverview(
        leagueName: string,
        typeCategory: CurrencyCategoryType,
    ): Promise<PoeNinjaCurrencyResponseType> {
        const path = `data/currencyoverview?league=${leagueName}&type=${typeCategory}`;
        return (
            await this._axiosInstance.get<PoeNinjaCurrencyResponseType>(path)
        ).data;
    }

    private async _getItemOverview(
        leagueName: string,
        typeCategory: ItemCategoryType,
    ): Promise<PoeNinjaItemResponseType> {
        const path = `data/itemoverview?league=${leagueName}&type=${typeCategory}`;
        return (await this._axiosInstance.get<PoeNinjaItemResponseType>(path))
            .data;
    }
}

// export function isCurrencyOverviewTypeCategory(
//     key: string,
// ): key is CurrencyOverviewTypeCategory {
//     return Object.values(CURRENCY_OVERVIEW_TYPE_CATEGORY).includes(key);
// }
// export function isItemOverviewTypeCategory(
//     key: string,
// ): key is ItemOverviewTypeCategory {
//     return Object.values(ITEM_OVERVIEW_TYPE_CATEGORY).includes(key);
// }

export const CURRENCY_CATEGORY = Object.freeze({
    CURRENCY: "Currency",
    FRAGMENTS: "Fragments",
});

export const ITEM_CATEGORY = Object.freeze({
    // TATTOOS: "Tattoo",
    OMENS: "Omen",
    DIVINATION_CARDS: "DivinationCard",
    ARTIFACTS: "Artifact",
    OILS: "Oil",
    INCUBATORS: "Incubator",
    UNIQUE_WEAPONS: "UniqueWeapon",
    UNIQUE_ARMOURS: "UniqueArmour",
    UNIQUE_ACCESSORIES: "UniqueAccessory",
    UNIQUE_FLASKS: "UniqueFlask",
    UNIQUE_JEWELS: "UniqueJewel",
    UNIQUE_RELICS: "UniqueRelic",
    SKILL_GEMS: "SkillGem",
    CLUSTER_JEWELS: "ClusterJewel",
    MAPS: "Map",
    BLIGHTED_MAPS: "BlightedMap",
    BLIGHTED_RAVAGED_MAPS: "BlightRavagedMap",
    SCOURGED_MAPS: "ScourgedMap",
    UNIQUE_MAPS: "UniqueMap",
    DELIRIUM_ORBS: "DeliriumOrb",
    INVITATIONS: "Invitation",
    SCARABS: "Scarab",
    // MEMORIES: "Memory",
    // BASE_TYPES: "BaseType",
    FOSSILS: "Fossil",
    RESONATORS: "Resonator",
    // BEASTS: "Beast",
    ESSENCES: "Essence",
    // VIALS: "Vial",
});
// export const ALL_CATEGORY_OBJ = Object.freeze(
//     Object.assign(CURRENCY_CATEGORY, ITEM_CATEGORY),
// );

export const ALL_CATEGORY = [
    ...Object.values(CURRENCY_CATEGORY),
    ...Object.values(ITEM_CATEGORY),
] as const;
