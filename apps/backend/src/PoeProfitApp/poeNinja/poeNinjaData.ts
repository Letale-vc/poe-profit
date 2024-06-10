import { FileManager } from "../Helpers/fileManager/fileManager.js";
import { PoeNinjaApi, ALL_CATEGORY } from "./poeNinjaApi.js";
import type {
    PoeNinjaCurrencyResponseType,
    CurrencyNinjaType,
    PoeNinjaItemResponseType,
    ItemNinjaType,
} from "./types/PoeNinjaResponseTypes.js";
import type { PoeNinjaDataType, CategoryDataType, CategoryType } from "./types/HelpersTypes.js";

export class PoeNinjaData {
    #ninjaApi: PoeNinjaApi;
    #fileManager: FileManager<PoeNinjaDataType>;

    constructor(ninjaApi: PoeNinjaApi, fileManager: FileManager<PoeNinjaDataType>) {
        this.#ninjaApi = ninjaApi;
        this.#fileManager = fileManager;
    }

    init(): void {
        this.#fileManager.init({} as PoeNinjaDataType);
    }
    getKeyData<T extends CategoryType>(key: T): CategoryDataType<T> | undefined {
        const data = this.#fileManager.loadFile();
        return data[key];
    }
    getAllData(): PoeNinjaDataType {
        return this.#fileManager.loadFile();
    }

    async updateNinjaData(leagueName: string): Promise<void> {
        const data = await this.#ninjaApi.getAllNinjaData(leagueName);
        this.#fileManager.saveFile(data);
    }
    #findItemIfHaveCategory(
        itemName: string,
        categories: CategoryType[],
    ): FindItemInNinjaType | undefined {
        for (const key of categories) {
            const items = this.getKeyData(key);
            if (!items) continue;

            const item = this.#findItem(items, itemName);
            if (item === undefined) {
                continue;
            }
            const res = this.#createFindObject(key, item, items);
            return res;
        }
        return undefined;
    }
    #createFindObject<K extends CategoryType>(
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
    #findItem(
        items: PoeNinjaCurrencyResponseType | PoeNinjaItemResponseType,
        itemName: string,
    ): ItemNinjaType | CurrencyNinjaType | undefined {
        return items.lines.find((item) => {
            if ("currencyTypeName" in item) {
                return item.currencyTypeName === itemName;
            }
            if ("name" in item) {
                return item.name === itemName && !item.detailsId.split("-").includes("relic");
            }
            return false;
        });
    }

    #findItemHaveOnlyString(itemName: string): FindItemInNinjaType | undefined {
        for (const key of ALL_CATEGORY) {
            const items = this.getKeyData(key);
            if (!items) continue;
            const item = this.#findItem(items, itemName);
            if (item === undefined) {
                continue;
            }
            const res = this.#createFindObject(key, item, items);
            return res;
        }
        return undefined;
    }

    findItem(itemName: string, categories?: CategoryType[]): FindItemInNinjaType | undefined {
        if (categories !== undefined) {
            return this.#findItemIfHaveCategory(itemName, categories);
        }
        return this.#findItemHaveOnlyString(itemName);
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
