import type { PoeTradeFetch } from "poe-trade-fetch";
import type { GlobalSettings } from "./globalSettings/globalSettingsFileManager.js";
import type { SettingsType } from "./globalSettings/types/GlobalSettingsType.js";
import type { STATUS_CODE } from "./helpers/utils.js";
import { ItemSearcher } from "./itemSearch/itemSearcher.js";
import type { PoeNinjaData } from "./poeNinja/poeNinjaData.js";

export abstract class Updater {
    private static _poeTradeFetch: PoeTradeFetch;

    get poeTradeFetch(): PoeTradeFetch {
        return Updater._poeTradeFetch;
    }

    private static _globalSettings: GlobalSettings;

    get globalSettings(): SettingsType {
        return Updater._globalSettings.getSettings();
    }

    private static _ninjaData: PoeNinjaData;
    get poeNinjaData(): PoeNinjaData {
        return Updater._ninjaData;
    }
    private static _itemSearcher: ItemSearcher;
    get itemSearcher(): ItemSearcher {
        return Updater._itemSearcher;
    }
    abstract name: string;

    static init(
        globalSettings: GlobalSettings,
        poeNinjaData: PoeNinjaData,
        poeTradeFetch: PoeTradeFetch,
    ) {
        Updater._globalSettings = globalSettings;
        Updater._ninjaData = poeNinjaData;
        Updater._poeTradeFetch = poeTradeFetch;
        Updater._itemSearcher = new ItemSearcher(Updater._poeTradeFetch);
    }
    init(): Promise<void> | void {}

    abstract getAllData(): unknown;

    abstract update(): Promise<STATUS_CODE>;
}
