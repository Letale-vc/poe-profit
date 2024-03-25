import { PoeTradeFetch } from "poe-trade-fetch";
import type { GlobalSettingsType } from "../GlobalSettings/index.js";
import type { NinjaData } from "../NinjaData/NinjaData.js";

export default abstract class Updater {
    globalSettings;
    poeApi;
    ninjaData;
    abstract name: string;

    constructor(
        globalSettings: GlobalSettingsType,
        poeApi: PoeTradeFetch,
        ninjaData: NinjaData,
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

export type UpdaterArgType = [GlobalSettingsType, PoeTradeFetch, NinjaData];
