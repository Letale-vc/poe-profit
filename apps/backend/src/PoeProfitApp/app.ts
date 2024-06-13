import fs from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { LEAGUES_NAMES, PoeTradeFetch } from "poe-trade-fetch";
import CurrencyPriceFinder from "./currency/currencyPriceFinder.js";
import { GlobalSettings } from "./globalSettings/globalSettingsFileManager.js";
import { FileManager } from "./helpers/fileManager/fileManager.js";
import logger from "./helpers/logger.js";
import { PoeNinjaApi } from "./poeNinja/poeNinjaApi.js";
import { PoeNinjaData } from "./poeNinja/poeNinjaData.js";
import { Updater } from "./updater.js";

export interface Plugin {
    active: boolean;
    name: string;
    id: number;
    updater: Updater;
}

export class PoeProfitApp {
    isInitApp = false;

    #plugins: Plugin[] = [];

    #poeTradeFetch: PoeTradeFetch;

    #updateCode = 0;

    #poeNinjaData: PoeNinjaData;

    currency: CurrencyPriceFinder;

    globalSettings: GlobalSettings;

    #changeCode(code: number) {
        this.#updateCode = code;
    }

    constructor() {
        this.globalSettings = GlobalSettings.getInstance();
        this.#poeTradeFetch = PoeTradeFetch.getInstance({
            userAgent: "poeProfitApp",
            leagueName: LEAGUES_NAMES.Current,
            realm: "pc",
        });
        this.currency = new CurrencyPriceFinder(this.#poeTradeFetch);
        this.#poeNinjaData = new PoeNinjaData(
            new PoeNinjaApi(),
            new FileManager("ninjaData.json"),
        );
    }

    static countInstance = 0;

    getAllProfitData(): Record<string, unknown> {
        const data: Record<string, unknown> = {};
        for (const plugin of this.#plugins) {
            data[plugin.name] = plugin.updater.getAllData();
        }
        return data;
    }
    async init(): Promise<void> {
        if (this.isInitApp) return;

        this.globalSettings.init();
        await this.#poeTradeFetch.updateLeagueName();
        logger.info(`Current leagueName: ${this.#poeTradeFetch.leagueName}`);
        this.#poeNinjaData.init();
        Updater.init(
            this.globalSettings,
            this.#poeNinjaData,
            this.#poeTradeFetch,
        );

        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        const pluginDir = join(__dirname, "plugins");
        await this.#loadPlugins(pluginDir);

        await Promise.all(this.#plugins.map((plugin) => plugin.updater.init()));

        this.isInitApp = true;
        logger.info("Initial app success.");
    }

    async #loadPlugins(dir: string): Promise<void> {
        const files = fs.readdirSync(dir);
        // Loop over each file
        for (const [i, file] of files.entries()) {
            // Get the full path of the file
            const filePath = join(dir, file);

            // Check if the file is a directory
            if (fs.statSync(filePath).isDirectory()) {
                // Recursively load plugins in the directory
                await this.#loadPlugins(filePath);
            } else if (
                filePath.endsWith("updater.js") ||
                filePath.endsWith("updater.ts")
            ) {
                // Dynamically import the module
                const filePathUrl = new URL(`file://${filePath}`);
                const PluginModule = (await import(filePathUrl.toString())) as {
                    default: new () => Updater;
                };
                const pluginInstance = new PluginModule.default();
                const pluginsSettings =
                    this.globalSettings.settingsCash?.plugins?.find(
                        (el) => el.name === pluginInstance.name,
                    );
                if (!pluginsSettings) {
                    this.globalSettings.mutate({
                        ...this.globalSettings.settingsCash,
                        plugins: [
                            ...(this.globalSettings.settingsCash?.plugins ??
                                []),
                            { active: true, name: pluginInstance.name },
                        ],
                    });
                }
                const active = pluginsSettings?.active ?? true;

                this.#plugins.push({
                    active: active,
                    id: i,
                    name: pluginInstance.name,
                    updater: pluginInstance,
                });
                logger.info(`Plugin ${pluginInstance.name} loaded.`);
            }
        }
    }
    async start(): Promise<void> {
        if (!this.isInitApp) {
            await this.init();
        }
        this.#changeCode(0);
        logger.info("Start process update data.");

        while (this.#updateCode === 0) {
            const activePlugins = this.#plugins.filter((el) => el.active);
            if (activePlugins.length === 0) {
                this.#restart(5);
                break;
            }
            try {
                await this.#poeNinjaData.updateNinjaData(
                    this.#poeTradeFetch.leagueName,
                );
                await this.#poeTradeFetch.updateConfig();
                await this.#updateCurrencyPrice();
                for (const plugin of activePlugins) {
                    logger.info(`${plugin.name} START update`);
                    await plugin.updater.update();
                    logger.info(`${plugin.name} END update`);
                }
            } catch (error) {
                logger.warn("Stop process update data.");
                if (error === 3) {
                    this.#restart(30);
                } else {
                    this.#restart(0);
                }
                break;
            }
        }
    }

    #restart(timeInMin = 30): void {
        this.#changeCode(1);
        logger.info(`Restart after ${timeInMin} min.`);
        const time = timeInMin * 60000;
        setTimeout(() => {
            void this.start();
        }, time);
    }

    async #updateCurrencyPrice() {
        await this.currency.update();
    }
}
