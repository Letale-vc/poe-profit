import axios, { type AxiosInstance } from "axios";
import type {
    CurrencyNinjaResponseType,
    ItemNinjaResponseType,
} from "./types/NinjaResponseTypes.js";
import type {
    CurrencyOverviewTypeCategory,
    ItemOverviewTypeCategory,
    NinjaAllDataType,
} from "./types/helpers.js";

export default class NinjaApi {
    #baseURL = new URL("https://poe.ninja/api");

    #axiosInstance: AxiosInstance;

    constructor() {
        this.#axiosInstance = axios.create({
            baseURL: this.#baseURL.toString(),
        });
    }

    async getAllNinjaItemsData(leagueName: string): Promise<NinjaAllDataType> {
        const currencyPromises = Object.values(
            CURRENCY_OVERVIEW_TYPE_CATEGORY,
        ).map(async (category) => {
            const response = await this.#getCurrencyOverview(
                leagueName,
                category,
            );

            return { [category]: response };
        });
        const itemPromises = Object.values(ITEM_OVERVIEW_TYPE_CATEGORY).map(
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
                                CurrencyOverviewTypeCategory,
                                CurrencyNinjaResponseType
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
                            Record<
                                ItemOverviewTypeCategory,
                                ItemNinjaResponseType
                            >
                        >
                    ).value,
            );

        const CurrencyCategory = Object.assign(
            {},
            ...currencyResponses,
        ) as Record<CurrencyOverviewTypeCategory, CurrencyNinjaResponseType>;

        const ItemCategory = Object.assign({}, ...itemResponses) as Record<
            ItemOverviewTypeCategory,
            ItemNinjaResponseType
        >;
        const ninjaData = { ...CurrencyCategory, ...ItemCategory };

        return ninjaData;
    }

    async #getCurrencyOverview(
        leagueName: string,
        typeCategory: CurrencyOverviewTypeCategory,
    ): Promise<CurrencyNinjaResponseType> {
        const path = `data/currencyoverview?league=${leagueName}&type=${typeCategory}`;
        return (await this.#axiosInstance.get<CurrencyNinjaResponseType>(path))
            .data;
    }

    async #getItemOverview(
        leagueName: string,
        typeCategory: ItemOverviewTypeCategory,
    ): Promise<ItemNinjaResponseType> {
        const path = `data/itemoverview?league=${leagueName}&type=${typeCategory}`;
        return (await this.#axiosInstance.get<ItemNinjaResponseType>(path))
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

export const CURRENCY_OVERVIEW_TYPE_CATEGORY = {
    CURRENCY: "Currency",
    FRAGMENTS: "Fragments",
} as const;

export const ITEM_OVERVIEW_TYPE_CATEGORY = {
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

export const OVERVIEW_CATEGORY = [
    ...Object.values(CURRENCY_OVERVIEW_TYPE_CATEGORY),
    ...Object.values(ITEM_OVERVIEW_TYPE_CATEGORY),
] as const;
