import { FileManager } from "../helpers/fileManager/fileManager.js";
import { ALL_CATEGORY, PoeNinjaApi } from "./poeNinjaApi.js";
import type {
    CategoryDataType,
    CategoryType,
    PoeNinjaDataType,
} from "./types/HelpersTypes.js";
import type {
    CurrencyNinjaType,
    ItemNinjaType,
    PoeNinjaCurrencyResponseType,
    PoeNinjaItemResponseType,
} from "./types/PoeNinjaResponseTypes.js";

export class PoeNinjaData {
    private static readonly FILE_NAME = "poeNinjaData.json";
    private readonly _ninjaApi: PoeNinjaApi;
    private readonly _fileManager: FileManager<PoeNinjaDataType>;

    constructor() {
        this._ninjaApi = new PoeNinjaApi();
        this._fileManager = new FileManager<PoeNinjaDataType>(
            PoeNinjaData.FILE_NAME,
        );
        this._fileManager.init({} as PoeNinjaDataType);
    }

    async getKeyData<T extends CategoryType>(
        key: T,
    ): Promise<CategoryDataType<T> | undefined> {
        const data = await this._fileManager.loadFile();
        if (data) {
            return data[key];
        }
        return undefined;
    }
    async getAllData(): Promise<PoeNinjaDataType | undefined> {
        return await this._fileManager.loadFile();
    }

    public async updateData(leagueName: string): Promise<void> {
        const data = await this._ninjaApi.getAllNinjaData(leagueName);
        await this._fileManager.saveFile(data);
    }

    private async _findItemIfHaveCategory(
        itemName: string,
        categories: CategoryType[],
    ): Promise<FindItemInNinjaType | undefined> {
        for (const key of categories) {
            const items = await this.getKeyData(key);
            if (!items) continue;

            const item = this._findItem(items, itemName);
            if (item === undefined) {
                continue;
            }
            const res = this._createFindObject(key, item, items);
            return res;
        }
        return undefined;
    }
    private _createFindObject<K extends CategoryType>(
        key: CategoryType,
        item: ItemNinjaType | CurrencyNinjaType,
        items: CategoryDataType<K>,
    ): FindItemInNinjaType | undefined {
        if ("currencyTypeName" in item && "currencyDetails" in items) {
            const currencyDetails = items.currencyDetails.find(
                (x) => x.name === item.currencyTypeName,
            );
            if (currencyDetails === undefined) {
                return undefined;
            }
            return {
                category: key,
                icon: currencyDetails.icon,
                name: item.currencyTypeName,
                baseType: "",
                tradeId: currencyDetails.tradeId,
                detailsId: item.detailsId,
            };
        }
        if ("name" in item) {
            return {
                category: key,
                icon: item.icon,
                name: item.name,
                baseType: item.baseType,
                tradeId: undefined,
                detailsId: item.detailsId,
                stackSize: item.stackSize,
            };
        }
        return undefined;
    }

    private _findItem(
        items: PoeNinjaCurrencyResponseType | PoeNinjaItemResponseType,
        itemName: string,
    ): ItemNinjaType | CurrencyNinjaType | undefined {
        return items.lines.find((item) => {
            if ("currencyTypeName" in item) {
                return item.currencyTypeName === itemName;
            }
            if ("name" in item) {
                return (
                    item.name === itemName &&
                    !item.detailsId.split("-").includes("relic")
                );
            }
            return false;
        });
    }

    private async _findItemHaveOnlyString(
        itemName: string,
    ): Promise<FindItemInNinjaType | undefined> {
        for (const key of ALL_CATEGORY) {
            const items = await this.getKeyData(key);
            if (!items) continue;
            const item = this._findItem(items, itemName);
            if (item === undefined) {
                continue;
            }
            const res = this._createFindObject(key, item, items);
            return res;
        }
        return undefined;
    }

    async findItem(
        itemName: string,
        categories?: CategoryType[],
    ): Promise<FindItemInNinjaType | undefined> {
        if (categories !== undefined) {
            return this._findItemIfHaveCategory(itemName, categories);
        }
        return this._findItemHaveOnlyString(itemName);
    }
}

export interface FindItemInNinjaType {
    category: string;
    icon?: string;
    name: string;
    baseType: string;
    tradeId?: string;
    detailsId?: string;
    stackSize?: number;
}
