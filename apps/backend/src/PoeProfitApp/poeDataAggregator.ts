import { LEAGUES_NAMES, PoeTradeFetch } from "poe-trade-fetch";
import type { CoreSettings } from "./CoreSettings/coreSettings.js";
import CurrencyPriceFinder from "./currency/currencyPriceFinder.js";
import { ItemSearcher } from "./itemSearch/itemSearcher.js";
import { PoeNinjaData } from "./poeNinja/poeNinjaData.js";
import type { SettingsContainer } from "./settingsContainer.js";

export class PoeDataAggregator {
    private readonly _coreSettings: CoreSettings;
    readonly poeTradeFetch: PoeTradeFetch;
    readonly poeNinjaData: PoeNinjaData;
    readonly currencyPriceFinder: CurrencyPriceFinder;
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
        this.currencyPriceFinder = new CurrencyPriceFinder(this.poeTradeFetch);
        this.poeNinjaData = new PoeNinjaData();
    }
    async init() {
        await this.poeTradeFetch.init();
    }

    async update() {
        await this.currencyPriceFinder.update();
        await this.poeNinjaData.updateData(
            this.poeTradeFetch.leagueName || "Standard",
        );
    }
}
