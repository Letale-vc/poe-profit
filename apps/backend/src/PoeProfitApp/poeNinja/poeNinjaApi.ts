import axios, { type AxiosInstance } from "axios";
import type {
    PoeNinjaCurrencyResponseType,
    PoeNinjaItemResponseType,
} from "./types/PoeNinjaResponseTypes.js";
import type {
    CurrencyCategoryType,
    ItemCategoryType,
    PoeNinjaDataType,
} from "./types/HelpersTypes.js";

export class PoeNinjaApi {
    #baseURL = new URL("https://poe.ninja/api");

    #axiosInstance: AxiosInstance;

    constructor() {
        this.#axiosInstance = axios.create({
            baseURL: this.#baseURL.toString(),
        });
    }

    async getAllNinjaData(leagueName: string): Promise<PoeNinjaDataType> {
        const currencyPromises = Object.values(CURRENCY_CATEGORY).map(
            async (category) => {
                const response = await this.#getCurrencyOverview(
                    leagueName,
                    category,
                );

                return { [category]: response };
            },
        );
        const itemPromises = Object.values(ITEM_CATEGORY).map(
            async (category) => {
                const response = await this.#getItemOverview(
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

        const itemResponses = (await Promise.allSettled(itemPromises))
            .filter((x) => x.status === "fulfilled")
            .map(
                (x) =>
                    (
                        x as PromiseFulfilledResult<
                            Record<ItemCategoryType, PoeNinjaItemResponseType>
                        >
                    ).value,
            );

        const CurrencyCategory = Object.assign(
            {},
            ...currencyResponses,
        ) as Record<CurrencyCategoryType, PoeNinjaCurrencyResponseType>;

        const ItemCategory = Object.assign({}, ...itemResponses) as Record<
            ItemCategoryType,
            PoeNinjaItemResponseType
        >;
        const ninjaData = { ...CurrencyCategory, ...ItemCategory };

        return ninjaData;
    }

    async #getCurrencyOverview(
        leagueName: string,
        typeCategory: CurrencyCategoryType,
    ): Promise<PoeNinjaCurrencyResponseType> {
        const path = `data/currencyoverview?league=${leagueName}&type=${typeCategory}`;
        return (
            await this.#axiosInstance.get<PoeNinjaCurrencyResponseType>(path)
        ).data;
    }

    async #getItemOverview(
        leagueName: string,
        typeCategory: ItemCategoryType,
    ): Promise<PoeNinjaItemResponseType> {
        const path = `data/itemoverview?league=${leagueName}&type=${typeCategory}`;
        return (await this.#axiosInstance.get<PoeNinjaItemResponseType>(path))
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

export const CURRENCY_CATEGORY = {
    CURRENCY: "Currency",
    FRAGMENTS: "Fragments",
} as const;

export const ITEM_CATEGORY = {
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
} as const;

export const ALL_CATEGORY = [
    ...Object.values(CURRENCY_CATEGORY),
    ...Object.values(ITEM_CATEGORY),
] as const;
