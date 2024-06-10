import _ from "lodash";
import type { RequestBodyType } from "poe-trade-fetch";
import logger from "../../Helpers/logger.js";
import { PriceCalculation } from "../../Helpers/priceCalculation/priceCalculation.js";
import { FileManager } from "../../Helpers/fileManager/fileManager.js";
import { ItemSearcher, type ItemSearchResultType } from "../../searchItems/ItemSearcher.js";
import Updater, { type UpdaterArgType } from "../../updater/updater.js";
import { DataManager } from "./DataManager.js";
import type { GemItemType, GemsExpProfit, RequestGemList } from "./Types/HelpersTypes.js";

export class AwakenedGemsExpUpdater extends Updater {
    #fileManager;
    #dataManager;
    #itemSearcher;
    name;
    constructor(...arg: UpdaterArgType) {
        super(...arg);
        this.#fileManager = new FileManager<Record<string, GemsExpProfit>>(
            "AwakenedGemsExp.json",
            "object",
        );
        this.#dataManager = new DataManager(this.#fileManager);
        this.#itemSearcher = new ItemSearcher(this.poeApi);
        this.name = "Awakened Gems Exp";
    }

    init() {
        this.#fileManager.init();
    }

    getAllData(): Record<string, GemsExpProfit> {
        return this.#dataManager.getData();
    }
    async update(): Promise<void> {
        const gemsList = await this.#getAwakenedListGems();
        if (gemsList === undefined) return;
        const requestList = this.#createRequestList(gemsList);
        for (const el of requestList) {
            try {
                const buying = await this.#itemSearcher.fetchItemData(el.itemBuying);
                if (buying === undefined) continue;
                // TODO: update this if have in data
                if (buying.total === 0) {
                    logger.info(`No buying offers for ${el.gem}`);
                    continue;
                }
                const selling = await this.#itemSearcher.fetchItemData(el.itemSelling);
                if (selling === undefined) continue;
                // TODO: update this if have in data
                if (selling.total === 0) {
                    logger.info(`No selling offers for ${el.gem}`);
                    continue;
                }
                const profit = this.#createProfitObject(el, buying, selling);
                this.#dataManager.update(profit);
            } catch (e) {
                logger.error(e);
                throw e;
            }
        }
    }

    #createGemItemObject(req: RequestBodyType, res: ItemSearchResultType): GemItemType {
        const price = PriceCalculation.calculatePrice(res.result);
        const tradeLink = new URL(
            `https://www.pathofexile.com/trade/search/${this.poeApi.leagueName}`,
        );
        tradeLink.searchParams.append("q", JSON.stringify(req));
        return {
            tradeLink: tradeLink.toString(),
            icon: res.result[0].item.icon,
            name: res.result[0].item.baseType,
            listings: res.total,
            ...price,
        };
    }

    #createProfitObject(
        reqGem: RequestGemList,
        buying: ItemSearchResultType,
        selling: ItemSearchResultType,
    ): GemsExpProfit {
        const gemBuying = this.#createGemItemObject(reqGem.itemBuying, buying);
        const gemSelling = this.#createGemItemObject(reqGem.itemSelling, selling);

        return {
            id: reqGem.gem,
            itemBuying: gemBuying,
            itemSelling: gemSelling,
            ...this.#calculateProfit(gemBuying, gemSelling),
        };
    }

    #calculateProfit(
        gemBuying: GemItemType,
        gemSelling: GemItemType,
    ): {
        profitInDivine: number;
        profitInChaos: number;
    } {
        const profitInDivine = gemSelling.divineValue - gemBuying.divineValue;
        const profitInChaos = gemSelling.chaosValue - gemBuying.chaosValue;
        return {
            profitInDivine: _.round(profitInDivine, 2),
            profitInChaos: _.round(profitInChaos, 0),
        };
    }

    #createRequestList(gemsList: string[]): RequestGemList[] {
        return gemsList.map((el) => {
            return {
                gem: el,
                itemBuying: this.#createGemRequest(el, 1),
                itemSelling: this.#createGemRequest(el, 5),
            };
        });
    }

    #createGemRequest(gem: string, level: number): RequestBodyType {
        return {
            query: {
                status: { option: "online" },
                type: gem,
                filters: {
                    trade_filters: {
                        disabled: false,
                        filters: { price: { option: "chaos_divine" } },
                    },
                    misc_filters: {
                        disabled: false,
                        filters: {
                            gem_level: { min: level, max: level },
                            corrupted: { option: "false" },
                        },
                    },
                    type_filters: {
                        filters: { category: { option: "gem.supportgemplus" } },
                    },
                },
            },
            sort: { price: "asc" },
        };
    }
    async #getAwakenedListGems(): Promise<string[] | undefined> {
        try {
            const res = await this.poeApi.getTradeDataItems();
            const gems = res.result
                .find((el) => el.id === "gems")
                ?.entries.filter(
                    (el) =>
                        el.type.includes("Awakened") &&
                        !el.type.includes("Empower") &&
                        !el.type.includes("Enlighten") &&
                        !el.type.includes("Enhance"),
                )
                .map((el) => el.type);
            return gems;
        } catch (e) {
            logger.error(e);
            return undefined;
        }
    }
}
