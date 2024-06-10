import { PoeTradeFetch } from "poe-trade-fetch";
import type { GlobalSettingsType } from "../globalSettings/index.js";
import type { PoeNinjaData } from "../poeNinja/poeNinjaData.js";

export abstract class Updater {
    globalSettings;
    poeApi;
    ninjaData;
    abstract name: string;

    constructor(
        globalSettings: GlobalSettingsType,
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

export type UpdaterArgType = [GlobalSettingsType, PoeTradeFetch, PoeNinjaData];
