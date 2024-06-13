import _ from "lodash";
import type { RequestBodyType } from "poe-trade-fetch";
import type { TradeExchangeRequestType } from "poe-trade-fetch/Types/TradeExchangeRequestBodyType";
import { PoeTradeFetchError } from "poe-trade-fetch/poeTradeFetchError";
import { FileManager } from "../../helpers/fileManager/fileManager.js";
import logger from "../../helpers/logger.js";
import {
    calculateExchangePrice,
    calculatePrice,
} from "../../helpers/priceCalculation/priceCalculation.js";
import { STATUS_CODE } from "../../helpers/utils.js";
import type { ItemModifierType } from "../../poeNinja/types/PoeNinjaResponseTypes.js";
import { Updater } from "../../updater.js";
import { DataManager } from "./dataManager.js";
import {
    type ProfitDivCardType,
    ProfitableCardFinder,
} from "./profitableDivinationFinder.js";
import type { DivProfitObject, ItemType } from "./types/HelpersType.js";

export const DIVINATION_FLIP_DATA_FILE_NAME = "DivinationFlipData.json";
export default class DivinationFlipDataUpdater extends Updater {
    name;
    #fileManager: FileManager<Record<string, DivProfitObject>>;
    dataManager: DataManager;
    #profitableDivFinder: ProfitableCardFinder;

    constructor() {
        super();
        this.#fileManager = new FileManager<Record<string, DivProfitObject>>(
            DIVINATION_FLIP_DATA_FILE_NAME,
        );
        this.dataManager = new DataManager(this.#fileManager);
        this.#profitableDivFinder = new ProfitableCardFinder(this.poeNinjaData);
        this.name = "Divination Flip";
    }

    init() {
        this.#fileManager.init({});
    }

    getAllData(): Record<string, DivProfitObject> {
        return this.dataManager.getData();
    }

    async update(): Promise<STATUS_CODE> {
        const divProfitList = this.#profitableDivFinder.filterDivination();

        if (divProfitList.length === 0) return STATUS_CODE.OK;

        if (divProfitList !== undefined) {
            this.#removeObjectWithOutRequest(divProfitList);
        }

        for (const val of divProfitList) {
            try {
                const itemBuying = await this.#getItemBuying(val);
                if (itemBuying === undefined) continue;
                const itemSelling = await this.#getItemSelling(val);
                if (itemSelling === undefined) continue;

                const profitObject = this.#calculateProfit(
                    itemBuying,
                    itemSelling,
                    val,
                );
                this.dataManager.update(profitObject);
            } catch (error) {
                if (error instanceof PoeTradeFetchError) {
                    return STATUS_CODE.TRADE_LIMIT;
                }
                return STATUS_CODE.UNKNOWN_ERROR;
            }
        }
        return STATUS_CODE.OK;
    }
    #calculateProfit(
        itemBuying: ItemType,
        itemSelling: ItemType,
        profitReqObj: ProfitDivCardType,
    ): DivProfitObject {
        const profitInChaos =
            itemSelling.chaosValue -
            itemBuying.chaosValue * itemBuying.stackSize;
        const profitInDivine =
            itemSelling.divineValue -
            itemBuying.divineValue * itemBuying.stackSize;
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
    #createItemBuyingQuery(profitReqObj: ProfitDivCardType): RequestBodyType {
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
    async #getItemBuying(
        profitReqObj: ProfitDivCardType,
    ): Promise<ItemType | undefined> {
        const itemBuyingQuery = this.#createItemBuyingQuery(profitReqObj);
        const itemBuyRes = await this.itemSearcher.fetchItemDetails(
            itemBuyingQuery,
            2,
            3,
        );
        // TODO: only update old data
        if (itemBuyRes === undefined || itemBuyRes.total === 0)
            return undefined;
        const price = calculatePrice(itemBuyRes.result, 1);
        const tradeLink = this.itemSearcher.getTradeLink(itemBuyingQuery);
        return {
            tradeLink: tradeLink,
            icon: profitReqObj.divination.icon,
            name: itemBuyRes.result[0].item.baseType,
            stackSize: profitReqObj.divination.stackSize ?? 1,
            listings: itemBuyRes.total,
            ...price,
        };
    }
    #findPriceMultiplier(explicitMods: ItemModifierType[]) {
        if (explicitMods && explicitMods.length > 0) {
            const str = explicitMods[0].text;
            const match = str?.match(/\d+x/i);
            if (match) {
                const number = Number.parseInt(match[0], 10);
                return number;
            }
        }
        return 1;
    }
    #createItemSellingQuery<
        T extends TradeExchangeRequestType | RequestBodyType,
    >(profitReqObj: ProfitDivCardType): T {
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
    async #getItemSelling(
        profitReqObj: ProfitDivCardType,
    ): Promise<undefined | ItemType> {
        const sellingPriceMultiplier = this.#findPriceMultiplier(
            profitReqObj.divination.explicitModifiers,
        );
        if (profitReqObj.itemTake.tradeId) {
            const req =
                this.#createItemSellingQuery<TradeExchangeRequestType>(
                    profitReqObj,
                );
            const res = await this.itemSearcher.fetchExchangeData(req);
            if (res === undefined || res.total === 0) return undefined;
            const itemSellPrice = calculateExchangePrice(
                res,
                sellingPriceMultiplier,
            );
            const tradeLink = new URL(
                `https://www.pathofexile.com/trade/search/${this.poeTradeFetch.leagueName}`,
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
        }
        const req = this.#createItemSellingQuery<RequestBodyType>(profitReqObj);

        const res = await this.itemSearcher.fetchItemDetails(req, 2, 3);
        if (res === undefined || res.total === 0) return undefined;
        const itemSellPrice = calculatePrice(
            res.result,
            sellingPriceMultiplier,
        );
        return {
            tradeLink: this.itemSearcher.getTradeLink(req),
            icon: profitReqObj.itemTake.icon,
            name: profitReqObj.itemTake.name,
            stackSize: profitReqObj.itemTake.stackSize ?? 1,
            listings: res.total,
            ...itemSellPrice,
        };
    }

    #removeObjectWithOutRequest(profitDivList: ProfitDivCardType[]) {
        const actualData = this.dataManager.getData();
        for (const el of profitDivList) {
            if (!(el.id in actualData)) {
                this.dataManager.remove(el.id);
            }
        }
    }
}
