import { LEAGUES_NAMES, PoeTradeFetch } from "poe-trade-fetch";
import { Currency } from "./Currency/currency.js";
import type { CoreSettings } from "./coreSettings.js";
import { ItemSearcher } from "./itemSearch/itemSearcher.js";
import { PoeNinjaData } from "./poeNinja/poeNinjaData.js";
import type { SettingsContainer } from "./settingsContainer.js";

export class PoeDataAggregator {
    private readonly _coreSettings: CoreSettings;
    readonly poeTradeFetch: PoeTradeFetch;
    readonly poeNinjaData: PoeNinjaData;
    readonly poeTradeItemSearch: ItemSearcher;

    constructor(settings: SettingsContainer) {
        this._coreSettings = settings.coreSettings;
        this.poeTradeFetch = PoeTradeFetch.getInstance({
            userAgent: "poeProfitApp",
            leagueName: LEAGUES_NAMES.Current,
            realm: "pc",
            useRateLimitDelay: true,
        });
        this.poeTradeItemSearch = new ItemSearcher(this.poeTradeFetch);
        this.poeNinjaData = new PoeNinjaData();
    }
    async init() {
        await this.poeTradeFetch.init();
        Currency.init(this.poeTradeFetch);
    }

    async update() {
        await Currency.update();
        await this.poeNinjaData.updateData(
            this.poeTradeFetch.leagueName || "Standard",
        );
    }
}
