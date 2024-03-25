import fs from "fs";
import { dirname, join } from "path";
import { LEAGUES_NAMES, PoeTradeFetch } from "poe-trade-fetch";
import { fileURLToPath } from "url";
import CurrencyPriceFinder from "./Currency/CurrencyPriceFinder.js";
import { GlobalSettingsFileManager } from "./GlobalSettings/GlobalSettingsFileManager.js";
import logger from "./Helpers/Logger.js";
import { FileManager } from "./Helpers/WorkingWithFile/WorkingWithFile.js";
import NinjaApi from "./NinjaData/NinjaApi.js";
import { NinjaData } from "./NinjaData/NinjaData.js";
import type Updater from "./Updater/Updater.js";

export interface Plugin {
    active: boolean;
    name: string;
    id: number;
    updater: Updater;
}

export class PoeProfitApp {
    isInitApp = false;

    #plugins: Plugin[] = [];

    #poeApi: PoeTradeFetch;

    #updateCode = 0;

    #ninjaData: NinjaData;

    currency: CurrencyPriceFinder;

    globalSettings: GlobalSettingsFileManager;

    #changeCode(code: number) {
        this.#updateCode = code;
    }

    constructor() {
        this.globalSettings = GlobalSettingsFileManager.getInstance();
        this.#poeApi = PoeTradeFetch.getInstance({
            userAgent: "poeProfitApp",
            leagueName: LEAGUES_NAMES.Current,
            realm: "pc",
        });
        this.currency = new CurrencyPriceFinder(this.#poeApi);
        this.#ninjaData = new NinjaData(
            new NinjaApi(),
            new FileManager("ninjaData.json", "object"),
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

        await this.#poeApi.updateConfig();
        this.#ninjaData.init();
        logger.info(`Set leagueName: ${this.#poeApi.leagueName}`);
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
            } else if (filePath.endsWith("index.js") || filePath.endsWith("index.ts")) {
                // Dynamically import the module
                const PluginModule = (await import(filePath)) as {
                    default: new (..._: unknown[]) => Updater;
                };
                const pluginInstance = new PluginModule.default(
                    this.globalSettings,
                    this.#poeApi,
                    this.#ninjaData,
                );
                const pluginsSettings = this.globalSettings.settingsCash?.plugins?.find(
                    (el) => el.name === pluginInstance.name,
                );
                if (!pluginsSettings) {
                    this.globalSettings.saveFile({
                        ...this.globalSettings.settingsCash,
                        plugins: [
                            ...(this.globalSettings.settingsCash?.plugins ?? []),
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
                await this.#ninjaData.updateNinjaData(this.#poeApi.leagueName);
                await this.#poeApi.updateConfig();
                await this.#updateCurrencyPrice();
                for (const plugin of activePlugins) {
                    logger.info(`${plugin.name} START update`);
                    await plugin.updater.update();
                    logger.info(`[Flip app]: ${plugin.name} END update`);
                }
            } catch (err) {
                logger.warn("Stop process update data.");
                logger.error(err);
                this.#restart(0);
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
