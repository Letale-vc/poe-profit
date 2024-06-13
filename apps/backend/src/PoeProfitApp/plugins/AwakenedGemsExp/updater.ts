import _ from "lodash";
import type { RequestBodyType } from "poe-trade-fetch";
import { PoeTradeFetchError } from "poe-trade-fetch/poeTradeFetchError";
import { FileManager } from "../../helpers/fileManager/fileManager.js";
import logger from "../../helpers/logger.js";
import { calculatePrice } from "../../helpers/priceCalculation/priceCalculation.js";
import { STATUS_CODE } from "../../helpers/utils.js";
import {
    type ItemSearchResult,
    ItemSearcher,
} from "../../itemSearch/itemSearcher.js";
import { Updater } from "../../updater.js";
import { DataManager } from "./dataManager.js";
import type {
    GemItemType,
    GemsExpProfit,
    RequestGemList,
} from "./types/HelpersTypes.js";

export const AWAKENED_GEMS_EXP_DATA_FILE_NAME = "AwakenedGemsExp.json";
export default class AwakenedGemsExpUpdater extends Updater {
    #fileManager;
    #dataManager;
    #itemSearcher;
    name;
    constructor() {
        super();
        this.#fileManager = new FileManager<Record<string, GemsExpProfit>>(
            AWAKENED_GEMS_EXP_DATA_FILE_NAME,
        );
        this.#dataManager = new DataManager(this.#fileManager);
        this.#itemSearcher = new ItemSearcher(this.poeTradeFetch);
        this.name = "Awakened Gems Exp";
    }

    init() {
        this.#fileManager.init({});
    }

    getAllData(): Record<string, GemsExpProfit> {
        return this.#dataManager.getData();
    }
    async update(): Promise<STATUS_CODE> {
        const gemsList = await this.#getAwakenedListGems();
        if (gemsList === undefined) return STATUS_CODE.OK;
        const requestList = this.#createRequestList(gemsList);
        for (const el of requestList) {
            try {
                const buying = await this.#itemSearcher.fetchItemDetails(
                    el.itemBuying,
                );
                if (buying === undefined) continue;
                // TODO: update this if have in data
                if (buying.total === 0) {
                    logger.debug(`No buying offers for ${el.gem}`);
                    continue;
                }
                const selling = await this.#itemSearcher.fetchItemDetails(
                    el.itemSelling,
                );
                if (selling === undefined) continue;
                // TODO: update this if have in data
                if (selling.total === 0) {
                    logger.debug(`No selling offers for ${el.gem}`);
                    continue;
                }
                const profit = this.#createProfitObject(el, buying, selling);
                this.#dataManager.update(profit);
            } catch (error) {
                if (error instanceof PoeTradeFetchError) {
                    return STATUS_CODE.TRADE_LIMIT;
                }
                return STATUS_CODE.UNKNOWN_ERROR;
            }
        }
        return STATUS_CODE.OK;
    }

    #createGemItemObject(
        req: RequestBodyType,
        res: ItemSearchResult,
    ): GemItemType {
        const price = calculatePrice(res.result);
        const tradeLink = this.itemSearcher.getTradeLink(req);

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
        buying: ItemSearchResult,
        selling: ItemSearchResult,
    ): GemsExpProfit {
        const gemBuying = this.#createGemItemObject(reqGem.itemBuying, buying);
        const gemSelling = this.#createGemItemObject(
            reqGem.itemSelling,
            selling,
        );

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
        const res = await this.poeTradeFetch.getTradeDataItems();
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
    }
}
