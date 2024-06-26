import {
    CURRENCY_CATEGORY,
    ITEM_CATEGORY,
} from "../../poeNinja/poeNinjaApi.js";
import type {
    FindItemInNinjaType,
    PoeNinjaData,
} from "../../poeNinja/poeNinjaData.js";
import type { CategoryType } from "../../poeNinja/types/HelpersTypes.js";
import type { ItemNinjaType } from "../../poeNinja/types/PoeNinjaResponseTypes.js";

export class ProfitableCardFinder {
    divinationProfitList: ProfitDivCardType[];

    #ninjaData: PoeNinjaData;

    constructor(ninjaData: PoeNinjaData) {
        this.#ninjaData = ninjaData;
        this.divinationProfitList = [];
    }

    async filterDivination(): Promise<ProfitDivCardType[]> {
        const data = (
            await this.#ninjaData.getKeyData(ITEM_CATEGORY.DIVINATION_CARDS)
        )?.lines.filter((item) => item.chaosValue > 10);

        if (!data || data.length === 0) return [];

        const profitDiv: ProfitDivCardType[] = [];

        for (const value of data) {
            if (!value.explicitModifiers[0].text) continue;

            const effect_parse = this.parseExplicitText(
                value.explicitModifiers[0].text,
            );

            if (effect_parse === undefined) continue;
            const effectItem = await this.#ninjaData.findItem(
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
                    priceMultiplier: Number.parseInt(
                        text.match(/\d+x/i)?.[0] ?? "1",
                    ),
                    gemLevel:
                        Number.parseInt(
                            text.match(/Level \d+/)?.[0]?.split(" ")[1] ?? "",
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
        if (name) {
            name = this.#parseGemName(name);
        }
        return name;
    }
    #parseGemName(name: string): string {
        for (const gem of EXCEPTIONAL_GEMS) {
            if (name.includes(gem)) {
                return `${gem} Support`;
            }
        }
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
    typeCategories: CategoryType[];
    priceMultiplier: number;
    explicitItemName: string;
    gemLevel?: number;
    corrupted: boolean;
    awakenedGem: boolean;
}

const EXCEPTIONAL_GEMS = ["Empower", "Enlighten", "Enhance"];

const REGEX_REWARD = {
    divination: [ITEM_CATEGORY.DIVINATION_CARDS],
    unique: [
        ITEM_CATEGORY.UNIQUE_ARMOURS,
        ITEM_CATEGORY.UNIQUE_ACCESSORIES,
        ITEM_CATEGORY.UNIQUE_FLASKS,
        ITEM_CATEGORY.UNIQUE_JEWELS,
        ITEM_CATEGORY.UNIQUE_MAPS,
        ITEM_CATEGORY.UNIQUE_WEAPONS,
        ITEM_CATEGORY.UNIQUE_RELICS,
    ],
    gemItem: [ITEM_CATEGORY.SKILL_GEMS],
    currencyItem: [CURRENCY_CATEGORY.CURRENCY],
};
