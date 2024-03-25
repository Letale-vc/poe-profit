import logger from "../../Helpers/Logger.js";
import {
    CURRENCY_OVERVIEW_TYPE_CATEGORY,
    ITEM_OVERVIEW_TYPE_CATEGORY,
} from "../../NinjaData/NinjaApi.js";
import type {
    FindItemInNinjaType,
    NinjaData,
} from "../../NinjaData/NinjaData.js";
import type { ItemNinjaType } from "../../NinjaData/types/NinjaResponseTypes.js";
import type { OverviewCategory } from "../../NinjaData/types/helpers.js";

export class ProfitableCardFinder {
    divinationProfitList: ProfitDivCardType[];

    #ninjaData: NinjaData;

    constructor(ninjaData: NinjaData) {
        this.#ninjaData = ninjaData;
        this.divinationProfitList = [];
    }

    filterDivination(): ProfitDivCardType[] {
        logger.info("Search profitable divination cards");
        const data = this.#ninjaData
            .getKeyData(ITEM_OVERVIEW_TYPE_CATEGORY.DIVINATION_CARDS)
            ?.lines.filter((item) => item.chaosValue > 10);
        if (!data || data.length === 0) return [];

        const profitDiv: ProfitDivCardType[] = [];

        for (const value of data) {
            if (!value.explicitModifiers[0].text) continue;

            const effect_parse = this.parseExplicitText(
                value.explicitModifiers[0].text,
            );

            if (effect_parse === undefined) continue;
            const effectItem = this.#ninjaData.findItem(
                effect_parse.explicitItemName,
                effect_parse.typeCategories,
            );

            if (effectItem !== undefined) {
                profitDiv.push({
                    divination: value,
                    itemTake: effectItem,
                    effectInfo: effect_parse,
                    id: `${value.detailsId}_${effectItem.detailsId}`,
                });
            }
        }
        return profitDiv;
    }

    parseExplicitText(text: string): EffectType | undefined {
        for (const [key, value] of Object.entries(REGEX_REWARD)) {
            if (text.match(key)) {
                const name = this.#parseName(text);

                if (!name) return undefined;
                return {
                    typeCategories: value,
                    explicitItemName: name,
                    priceMultiplier: parseInt(text.match(/\d+x/i)?.[0] ?? "1"),
                    levelGem:
                        parseInt(
                            text.match(/Level \d+/i)?.[0]?.split(" ")[1] ?? "",
                        ) || undefined,
                    corrupted: !!text.match(/corrupted/),
                    awakenedGem: !!text.match(/awakened/),
                };
            }
        }
        return undefined;
    }

    #parseName(text: string): string | undefined {
        let name: string | undefined;
        const firstMatch = text.match(/{([^}]+)}/g);
        if (firstMatch) {
            name = firstMatch[0]?.match(/{\d*x?\s?(.*)}/)?.[1];
        }
        if (!name) return undefined;
        if (EXCEPTIONAL_GEMS.includes(name)) return `${name} Support`;
        return name;
    }
}

export interface ProfitDivCardType {
    id: string;
    divination: ItemNinjaType;
    itemTake: FindItemInNinjaType;
    effectInfo: EffectType;
}
interface EffectType {
    typeCategories: OverviewCategory[];
    priceMultiplier: number;
    explicitItemName: string;
    levelGem?: number;
    corrupted: boolean;
    awakenedGem: boolean;
}

const EXCEPTIONAL_GEMS = ["Empower", "Enlighten", "Enhance"];

const REGEX_REWARD = {
    divination: [ITEM_OVERVIEW_TYPE_CATEGORY.DIVINATION_CARDS],
    unique: [
        ITEM_OVERVIEW_TYPE_CATEGORY.UNIQUE_ARMOURS,
        ITEM_OVERVIEW_TYPE_CATEGORY.UNIQUE_ACCESSORIES,
        ITEM_OVERVIEW_TYPE_CATEGORY.UNIQUE_FLASKS,
        ITEM_OVERVIEW_TYPE_CATEGORY.UNIQUE_JEWELS,
        ITEM_OVERVIEW_TYPE_CATEGORY.UNIQUE_MAPS,
        ITEM_OVERVIEW_TYPE_CATEGORY.UNIQUE_WEAPONS,
        ITEM_OVERVIEW_TYPE_CATEGORY.UNIQUE_RELICS,
    ],
    gemItem: [ITEM_OVERVIEW_TYPE_CATEGORY.SKILL_GEMS],
    currencyItem: [CURRENCY_OVERVIEW_TYPE_CATEGORY.CURRENCY],
};
