import _ from "lodash";
import type { RequestBodyType } from "poe-trade-fetch";
import { PoeTradeFetchError } from "poe-trade-fetch/poeTradeFetchError";
import { FileManager } from "../../helpers/fileManager/fileManager.js";
import { Logger } from "../../helpers/logger.js";
import { calculatePrice } from "../../helpers/priceCalculation/priceCalculation.js";
import { STATUS_CODE } from "../../helpers/utils.js";
import type {
    ItemSearchResult,
    ItemSearcher,
} from "../../itemSearch/itemSearcher.js";
import { Updater } from "../../updater.js";
import type { GemsExpSettings } from "./awakGemsExpSettings.js";
import { DataManager } from "./dataManager.js";
import type {
    GemItemType,
    GemsExpProfit,
    RequestGemList,
} from "./types/HelpersTypes.js";

export const AWAKENED_GEMS_EXP_DATA_FILE_NAME = "AwakenedGemsExp.json";
export default class AwakenedGemsExpUpdater extends Updater<GemsExpSettings> {
    private _fileManager;
    private _dataManager;
    private _poeTradeItemSearch!: ItemSearcher;
    name = "Awakened Gems Exp";
    constructor(settingsConstructor: new () => GemsExpSettings) {
        super(settingsConstructor);
        this._fileManager = new FileManager<Record<string, GemsExpProfit>>(
            AWAKENED_GEMS_EXP_DATA_FILE_NAME,
        );
        this._dataManager = new DataManager(this._fileManager);
        this._poeTradeItemSearch = this.poeDataAggregator.poeTradeItemSearch;
    }

    init(): boolean {
        this._fileManager.init({});
        return true;
    }

    async getAllData(): Promise<Record<string, GemsExpProfit>> {
        return this._dataManager.getData();
    }

    async update(): Promise<STATUS_CODE> {
        const gemsList = await this._getAwakenedListGems();
        if (gemsList === undefined) return STATUS_CODE.OK;
        const requestList = this._createRequestList(gemsList);
        for (const el of requestList) {
            try {
                const buying = await this._poeTradeItemSearch.fetchItemDetails(
                    el.itemBuying,
                );
                if (buying === undefined) continue;
                // TODO: update this if have in data
                if (buying.total === 0) {
                    Logger.debug(`No buying offers for ${el.gem}`);
                    continue;
                }
                const selling = await this._poeTradeItemSearch.fetchItemDetails(
                    el.itemSelling,
                );
                if (selling === undefined) continue;
                // TODO: update this if have in data
                if (selling.total === 0) {
                    Logger.debug(`No selling offers for ${el.gem}`);
                    continue;
                }
                const profit = this._createProfitObject(el, buying, selling);
                this._dataManager.update(profit);
            } catch (error) {
                if (error instanceof PoeTradeFetchError) {
                    return STATUS_CODE.TRADE_LIMIT;
                }
                return STATUS_CODE.UNKNOWN_ERROR;
            }
        }
        return STATUS_CODE.OK;
    }

    private _createGemItemObject(
        req: RequestBodyType,
        res: ItemSearchResult,
    ): GemItemType {
        const price = calculatePrice(res.result);
        const tradeLink = this._poeTradeItemSearch.getTradeLink(req);

        return {
            tradeLink: tradeLink.toString(),
            icon: res.result[0].item.icon,
            name: res.result[0].item.baseType,
            listings: res.total,
            ...price,
        };
    }

    private _createProfitObject(
        reqGem: RequestGemList,
        buying: ItemSearchResult,
        selling: ItemSearchResult,
    ): GemsExpProfit {
        const gemBuying = this._createGemItemObject(reqGem.itemBuying, buying);
        const gemSelling = this._createGemItemObject(
            reqGem.itemSelling,
            selling,
        );

        return {
            id: reqGem.gem,
            itemBuying: gemBuying,
            itemSelling: gemSelling,
            ...this._calculateProfit(gemBuying, gemSelling),
        };
    }

    private _calculateProfit(
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

    private _createRequestList(gemsList: string[]): RequestGemList[] {
        return gemsList.map((el) => {
            return {
                gem: el,
                itemBuying: this._createGemRequest(el, 1),
                itemSelling: this._createGemRequest(el, 5),
            };
        });
    }

    private _createGemRequest(gem: string, level: number): RequestBodyType {
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
    private async _getAwakenedListGems(): Promise<string[] | undefined> {
        const res =
            await this.poeDataAggregator.poeTradeFetch.getTradeDataItems();

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
