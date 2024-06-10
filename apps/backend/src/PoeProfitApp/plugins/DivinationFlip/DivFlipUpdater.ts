import _ from "lodash";
import type { RequestBodyType } from "poe-trade-fetch";
import type { TradeExchangeRequestType } from "poe-trade-fetch/Types/TradeExchangeRequestBodyType";
import logger from "../../Helpers/logger.js";
import { PriceCalculation } from "../../Helpers/priceCalculation/priceCalculation.js";
import { FileManager } from "../../Helpers/fileManager/fileManager.js";
import type { ItemModifierType } from "../../poeNinja/types/PoeNinjaResponseTypes.js";
import { ItemSearcher } from "../../searchItems/ItemSearcher.js";
import Updater, { type UpdaterArgType } from "../../updater/updater.js";
import { DataManager } from "./DataManager.js";
import {
    ProfitableCardFinder,
    type ProfitDivCardType as DivProfitNinjaInfo,
} from "./ProfitableDivinationFinder.js";
import type { DivProfitObject, ItemType } from "./types/HelpersType.js";

export class DivinationFlipDataUpdater extends Updater {
    name;
    #fileManager: FileManager<Record<string, DivProfitObject>>;
    dataManager: DataManager;
    #profitableDivFinder: ProfitableCardFinder;
    #itemSearcher: ItemSearcher;

    constructor(...arg: UpdaterArgType) {
        super(...arg);
        this.#fileManager = new FileManager<Record<string, DivProfitObject>>(
            "DivinationFlipData.json",
            "object",
        );
        this.dataManager = new DataManager(this.#fileManager);
        this.#profitableDivFinder = new ProfitableCardFinder(this.ninjaData);
        this.#itemSearcher = new ItemSearcher(this.poeApi);
        this.name = "Divination Flip";
    }

    init() {
        this.#fileManager.init();
    }

    getAllData(): Record<string, DivProfitObject> {
        return this.dataManager.getData();
    }
    async update() {
        const divProfitList = this.#profitableDivFinder.filterDivination();

        if (divProfitList.length === 0) return;

        if (divProfitList !== undefined) {
            this.#removeObjectWithOutRequest(divProfitList);
        }

        for (const val of divProfitList) {
            try {
                const itemBuying = await this.#getItemBuying(val);
                if (itemBuying === undefined) continue;
                const itemSelling = await this.#getItemSelling(val);
                if (itemSelling === undefined) continue;

                const profitObject = this.#calculateProfit(itemBuying, itemSelling, val);
                this.dataManager.update(profitObject);
            } catch (e) {
                logger.error(e);
                throw e;
            }
        }
    }
    #calculateProfit(
        itemBuying: ItemType,
        itemSelling: ItemType,
        profitReqObj: DivProfitNinjaInfo,
    ): DivProfitObject {
        const profitInChaos = itemSelling.chaosValue - itemBuying.chaosValue * itemBuying.stackSize;
        const profitInDivine =
            itemSelling.divineValue - itemBuying.divineValue * itemBuying.stackSize;
        const profitPerTradeInChaos = profitInChaos / itemBuying.stackSize;
        const profitPerTradeInDivine = profitInChaos / itemBuying.stackSize;

        return {
            id: profitReqObj.id,
            itemBuying,
            itemSelling,
            profitInChaos: _.round(profitInChaos),
            profitInDivine: _.round(profitInDivine, 2),
            profitPerTradeInChaos: _.round(profitPerTradeInChaos),
            profitPerTradeInDivine: _.round(profitPerTradeInDivine, 2),
        };
    }
    #createItemBuyingQuery(profitReqObj: DivProfitNinjaInfo): RequestBodyType {
        const trade_filters = {
            disabled: false,
            filters: {
                indexed: { option: "1day" },
                price: { option: "chaos_divine" },
            },
        } as const;
        const status = { option: "online" } as const;
        const itemBuyingQuery: RequestBodyType = {
            query: {
                status,
                type: profitReqObj.divination.baseType,
                filters: {
                    type_filters: {
                        disabled: false,
                        filters: { category: { option: "card" } },
                    },
                    trade_filters,
                },
            },
            sort: { price: "asc" },
        };
        return itemBuyingQuery;
    }
    async #getItemBuying(profitReqObj: DivProfitNinjaInfo): Promise<ItemType | undefined> {
        try {
            const itemBuyingQuery = this.#createItemBuyingQuery(profitReqObj);
            const itemBuyRes = await this.#itemSearcher.fetchItemData(itemBuyingQuery, 2, 3);
            // TODO: only update old data
            if (itemBuyRes === undefined || itemBuyRes.total === 0) return undefined;
            const price = PriceCalculation.calculatePrice(itemBuyRes.result, 1);
            const tradeLink = new URL(
                `https://www.pathofexile.com/trade/search/${this.poeApi.leagueName}`,
            );
            tradeLink.searchParams.append("q", JSON.stringify(itemBuyingQuery));
            return {
                tradeLink: tradeLink.toString(),
                icon: profitReqObj.divination.icon,
                name: itemBuyRes.result[0].item.baseType,
                stackSize: profitReqObj.divination.stackSize ?? 1,
                listings: itemBuyRes.total,
                ...price,
            };
        } catch (e) {
            logger.error(e);
            throw e;
        }
    }
    #findPriceMultiplier(explicitMods: ItemModifierType[]) {
        if (explicitMods && explicitMods.length > 0) {
            const str = explicitMods[0].text;
            const match = str?.match(/\d+x/i);
            if (match) {
                const number = parseInt(match[0], 10);
                return number;
            }
        }
        return 1;
    }
    #createItemSellingQuery<T extends TradeExchangeRequestType | RequestBodyType>(
        profitReqObj: DivProfitNinjaInfo,
    ): T {
        if (profitReqObj.itemTake.tradeId !== undefined) {
            const currencyTypeName = profitReqObj.itemTake.tradeId;
            const have = currencyTypeName === "divine" ? "chaos" : "divine";
            const req: TradeExchangeRequestType = {
                query: {
                    status: { option: "online" },
                    have: [have],
                    want: [currencyTypeName],
                    minimum: 5,
                },
                sort: { have: "acs" },
                engine: "new",
            };
            return req as T;
        }
        const trade_filters = {
            disabled: false,
            filters: {
                indexed: { option: "1day" },
                price: { option: "chaos_divine" },
            },
        } as const;
        const status = { option: "online" } as const;
        const name = profitReqObj.itemTake.name;
        const type = profitReqObj.itemTake.baseType;
        const query = name !== type ? { name } : { type };
        const corruptedFilter = profitReqObj.effectInfo.corrupted
            ? {}
            : { corrupted: { option: "false" } };
        const gemLevel =
            profitReqObj.effectInfo.gemLevel === undefined
                ? {}
                : {
                    gem_level: {
                        min: profitReqObj.effectInfo.gemLevel,
                        max: profitReqObj.effectInfo.gemLevel,
                    },
                };

        const req: RequestBodyType = {
            query: {
                ...query,
                status,
                filters: {
                    misc_filters: {
                        disabled: false,
                        filters: {
                            ...corruptedFilter,
                            ...gemLevel,
                        },
                    },
                    trade_filters,
                },
            },
            sort: { price: "asc" },
        };
        return req as T;
    }
    async #getItemSelling(profitReqObj: DivProfitNinjaInfo): Promise<undefined | ItemType> {
        const sellingPriceMultiplier = this.#findPriceMultiplier(
            profitReqObj.divination.explicitModifiers,
        );
        if (profitReqObj.itemTake.tradeId) {
            const req = this.#createItemSellingQuery<TradeExchangeRequestType>(profitReqObj);
            const res = await this.#itemSearcher.fetchExchangeData(req);
            if (res === undefined || res.total === 0) return undefined;
            const itemSellPrice = PriceCalculation.calculateExchangePrice(
                res,
                sellingPriceMultiplier,
            );
            const tradeLink = new URL(
                `https://www.pathofexile.com/trade/search/${this.poeApi.leagueName}`,
            );
            tradeLink.searchParams.append("q", JSON.stringify(req));
            return {
                tradeLink: tradeLink.toString(),
                icon: profitReqObj.itemTake.icon,
                name: profitReqObj.itemTake.name,
                stackSize: 1,
                listings: res.total,
                ...itemSellPrice,
            };
        } else {
            const req = this.#createItemSellingQuery<RequestBodyType>(profitReqObj);

            const res = await this.#itemSearcher.fetchItemData(req, 2, 3);
            if (res === undefined || res.total === 0) return undefined;
            const itemSellPrice = PriceCalculation.calculatePrice(
                res.result,
                sellingPriceMultiplier,
            );
            return {
                tradeLink: `https://www.pathofexile.com/trade/search/${this.poeApi.leagueName}?q=${JSON.stringify(req)}`,
                icon: profitReqObj.itemTake.icon,
                name: profitReqObj.itemTake.name,
                stackSize: profitReqObj.itemTake.stackSize ?? 1,
                listings: res.total,
                ...itemSellPrice,
            };
        }
    }

    #removeObjectWithOutRequest(profitDivList: DivProfitNinjaInfo[]) {
        const actualData = this.dataManager.getData();
        for (const el of profitDivList) {
            if (!(el.id in actualData)) {
                this.dataManager.remove(el.id);
            }
        }
    }
}
