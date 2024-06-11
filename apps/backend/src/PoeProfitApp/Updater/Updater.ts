import { PoeTradeFetch } from "poe-trade-fetch";
import type { PoeNinjaData } from "../poeNinja/poeNinjaData.js";
import type { SettingsType } from "../globalSettings/types/GlobalSettingsType.js";

export abstract class Updater {
    globalSettings;
    poeApi;
    ninjaData;
    abstract name: string;

    constructor(
        globalSettings: SettingsType,
        poeApi: PoeTradeFetch,
        ninjaData: PoeNinjaData,
    ) {
        this.globalSettings = globalSettings;
        this.poeApi = poeApi;
        this.ninjaData = ninjaData;
    }
    init(): Promise<void> | void {
        return Promise.resolve();
    }

    abstract getAllData(): unknown;

    abstract update(): Promise<void>;
}

export type UpdaterArgType = [SettingsType, PoeTradeFetch, PoeNinjaData];
