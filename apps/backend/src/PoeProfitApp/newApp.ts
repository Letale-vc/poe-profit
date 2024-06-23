import type { CoreSettings } from "./CoreSettings/coreSettings.js";
import { Logger } from "./helpers/logger.js";
import { STATUS_CODE } from "./helpers/utils.js";
import { PluginManager } from "./pluginManager.js";
import { PoeDataAggregator } from "./poeDataAggregator.js";
import { SettingsContainer } from "./settingsContainer.js";
import { Updater } from "./updater.js";

export interface Plugin {
    active: boolean;
    name: string;
    id: number;
    updater: Updater;
}

export class PoeProfitApp {
    private readonly _settings: SettingsContainer;
    private initialized = false;
    private readonly coreSettings: CoreSettings;

    public readonly _poeDataAggregator: PoeDataAggregator;

    private _pluginManager: PluginManager;
    private _statusCode = 0;

    constructor() {
        try {
            this._settings = new SettingsContainer();
            this.coreSettings = this._settings.coreSettings;
            this._poeDataAggregator = new PoeDataAggregator(this._settings);
            this._pluginManager = new PluginManager(
                this._settings,
                this._poeDataAggregator,
            );
        } catch (error) {
            Logger.error("Can't create PoeProfitApp instance.");
            throw error;
        }
    }

    async init(): Promise<void> {
        await this._poeDataAggregator.init();
        Logger.info("_poeDataAggregator init success.");
        Updater.init(this._poeDataAggregator, this._settings);
        Logger.info("Updater init success.");
        await this._pluginManager.init();
        Logger.info("PluginManager init success.");
        this.initialized = true;
        Logger.info("Initial app success.");
    }

    getAllProfitData(): Record<string, unknown> {
        const data: Record<string, unknown> = {};
        for (const plugin of this._pluginManager.plugins) {
            data[plugin.name] = plugin;
        }
        return data;
    }

    async start(): Promise<void> {
        Logger.info("Start process update data.");
        this._statusCode = 0;
        while (this._statusCode === 0 && this.initialized) {
            const activePlugins = this._pluginManager.plugins.filter(
                (el) => el.isEnable,
            );

            if (activePlugins.length === 0) {
                this._restart(1, 0);
                break;
            }

            try {
                await this._poeDataAggregator.update();

                for (const plugin of activePlugins) {
                    Logger.info(`${plugin.name} START update`);
                    const status = await plugin.update();
                    if (STATUS_CODE.TRADE_LIMIT === status) {
                        this._restart(30, status);
                        break;
                    }
                    Logger.info(`${plugin.name} END update`);
                }
            } catch (error) {
                this._restart(0, 0);
                break;
            }
        }
    }

    private _restart(timeInMin: number, statusCode: number): void {
        this._statusCode = statusCode;
        Logger.info(`Restart after ${timeInMin} min.`);
        const time = timeInMin * 60000;
        setTimeout(() => {
            void this.start();
        }, time);
    }

    stop(): void {
        this._settings.saveCoreSettings();
        this._pluginManager.closeAllPlugin();
        Logger.info("App stopped.");
    }
}
