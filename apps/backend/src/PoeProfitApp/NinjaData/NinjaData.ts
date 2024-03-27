import { FileManager } from "../Helpers/WorkingWithFile/WorkingWithFile.js";
import { default as NinjaApi, OVERVIEW_CATEGORY } from "./NinjaApi.js";
import type {
    CurrencyNinjaResponseType,
    CurrencyNinjaType,
    ItemNinjaResponseType,
    ItemNinjaType,
} from "./types/NinjaResponseTypes.js";
import type { NinjaAllDataType, NinjaDataAnyItemsType, OverviewCategory } from "./types/helpers.js";

export class NinjaData {
    #ninjaApi: NinjaApi;

    #fileManager;

    constructor(ninjaApi: NinjaApi, fileManager: FileManager<NinjaAllDataType>) {
        this.#ninjaApi = ninjaApi;
        this.#fileManager = fileManager;
    }

    init(): void {
        this.#fileManager.init();
    }
    getKeyData<T extends OverviewCategory>(key: T): NinjaDataAnyItemsType<T> | undefined {
        const data = this.#fileManager.loadFile();
        return data[key];
    }
    getAllData(): NinjaAllDataType {
        return this.#fileManager.loadFile();
    }

    async updateNinjaData(leagueName: string): Promise<void> {
        const data = await this.#ninjaApi.getAllNinjaItemsData(leagueName);
        this.#fileManager.saveFile(data);
    }
    #findItemIfHaveCategory(
        itemName: string,
        categories: OverviewCategory[],
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
    #createFindObject<K extends OverviewCategory>(
        key: OverviewCategory,
        item: ItemNinjaType | CurrencyNinjaType,
        items: NinjaDataAnyItemsType<K>,
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
        items: CurrencyNinjaResponseType | ItemNinjaResponseType,
        itemName: string,
    ): ItemNinjaType | CurrencyNinjaType | undefined {
        return items.lines.find((item) => {
            if ("currencyTypeName" in item) {
                return item.currencyTypeName === itemName;
            }
            if ("name" in item) {
                return item.name === itemName && item.detailsId.split("-").includes("relic");
            }
            return false;
        });
    }

    #findItemHaveOnlyString(itemName: string): FindItemInNinjaType | undefined {
        for (const key of OVERVIEW_CATEGORY) {
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

    findItem(itemName: string, categories?: OverviewCategory[]): FindItemInNinjaType | undefined {
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
