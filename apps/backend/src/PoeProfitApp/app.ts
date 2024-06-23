// import fs from "node:fs";
// import { dirname, join } from "node:path";
// import { fileURLToPath } from "node:url";
// import { LEAGUES_NAMES, PoeTradeFetch } from "poe-trade-fetch";
// import type { CoreSettings } from "./CoreSettings/coreSettings.js";
// import { GlobalSettings } from "./CoreSettings/coreSettingsFileManager.js";
// import CurrencyPriceFinder from "./currency/currencyPriceFinder.js";
// import { FileManager } from "./helpers/fileManager/fileManager.js";
// import logger from "./helpers/logger.js";
// import { STATUS_CODE } from "./helpers/utils.js";
// import { PluginSettings } from "./pluginSettings.js";
// import { PoeNinjaApi } from "./poeNinja/poeNinjaApi.js";
// import { PoeNinjaData } from "./poeNinja/poeNinjaData.js";
// import { Updater } from "./updater.js";

// export interface Plugin {
//     active: boolean;
//     name: string;
//     id: number;
//     updater: Updater;
// }
// class PluginBridge {
//     // biome-ignore lint/suspicious/noExplicitAny: <explanation>
//     private methods = new Map<string, (...args: any[]) => any>();

//     // biome-ignore lint/suspicious/noExplicitAny: <explanation>
//     getMethod<T extends (...args: any[]) => any>(name: string): T | null {
//         const result = this.methods.get(name);
//         return result as T | null;
//     } // biome-ignore lint/suspicious/noExplicitAny: <explanation>
//     saveMethod(name: string, method: (...args: any[]) => any): void {
//         this.methods.set(name, method);
//     }
// }

// export class PoeProfitApp {
//     #settings: CoreSettings;

//     ini = false;

//     #plugins: Updater[] = [];

//     #poeTradeFetch: PoeTradeFetch;

//     #updateCode = 0;

//     #poeNinjaData: PoeNinjaData;

//     currency: CurrencyPriceFinder;

//     globalSettings: GlobalSettings;

//     #changeCode(code: number) {
//         this.#updateCode = code;
//     }

//     constructor() {
//         this.globalSettings = new GlobalSettings();
//         this.#poeTradeFetch = PoeTradeFetch.getInstance({
//             userAgent: "poeProfitApp",
//             leagueName: LEAGUES_NAMES.Current,
//             realm: "pc",
//             useRateLimitDelay: true,
//         });
//         this.currency = new CurrencyPriceFinder(this.#poeTradeFetch);
//         this.#poeNinjaData = new PoeNinjaData(
//             new PoeNinjaApi(),
//             new FileManager("ninjaData.json"),
//         );
//     }

//     static countInstance = 0;

//     getAllProfitData(): Record<string, unknown> {
//         const data: Record<string, unknown> = {};
//         for (const plugin of this.#plugins) {
//             data[plugin.name] = plugin.getAllData();
//         }
//         return data;
//     }
//     async init(): Promise<void> {
//         if (this.isInitApp) return;

//         GlobalSettings.init();
//         await this.#poeTradeFetch.updateLeagueName();
//         logger.info(`Current leagueName: ${this.#poeTradeFetch.leagueName}`);
//         this.#poeNinjaData.init();
//         Updater.init(
//             this.globalSettings,
//             this.#poeNinjaData,
//             this.#poeTradeFetch,
//         );

//         await this.#newLoadPlugins();

//         await Promise.all(this.#plugins.map((plugin) => plugin.init()));

//         this.isInitApp = true;
//         logger.info("Initial app success.");
//     }

//     async #newLoadPlugins(): Promise<void> {
//         const updaterFileName =
//             process.env.NODE_ENV === "production" ? "updater.js" : "updater.ts";
//         const settingsFileName =
//             process.env.NODE_ENV === "production"
//                 ? "settings.js"
//                 : "settings.ts";
//         const __filename = fileURLToPath(import.meta.url);
//         const __dirname = dirname(__filename);
//         const pluginDir = join(__dirname, "plugins");
//         const files = fs.readdirSync(pluginDir).filter((x) => x !== "default");

//         for (const file of files) {
//             const pluginFolder = join(pluginDir, file);
//             const updaterPath = join(pluginFolder, updaterFileName);
//             const settingsPath = join(pluginFolder, settingsFileName);
//             if (fs.statSync(pluginFolder).isDirectory()) {
//                 if (!fs.existsSync(updaterPath)) {
//                     continue;
//                 }
//                 const updaterPathUrl = new URL(`file://${updaterPath}`);
//                 const pluginModule = await import(updaterPathUrl.toString());
//                 let pluginInstance: Updater | undefined;

//                 for (const someElement of pluginModule.entries()) {
//                     if (someElement instanceof Updater) {
//                         const updater =
//                             someElement as unknown as new () => Updater;
//                         pluginInstance = new updater();
//                         break;
//                     }
//                 }

//                 if (pluginInstance === undefined) {
//                     continue;
//                 }
//                 let pluginSetting: PluginSettings;
//                 if (fs.existsSync(settingsPath)) {
//                     const settingsPathUrl = new URL(`file://${settingsPath}`);
//                     const settingsModule = await import(
//                         settingsPathUrl.toString()
//                     );
//                     for (const someElement of settingsModule.entries()) {
//                         if (someElement instanceof PluginSettings) {
//                             const pluginSetting =
//                                 someElement as unknown as new () => PluginSettings;
//                             break;
//                         }
//                     }
//                 }

//                 const globalSettings = this.globalSettings.getSettings();
//                 const oldPluginSettings =
//                     globalSettings.plugins[pluginInstance.name];

//                 if (oldPluginSettings) {
//                     Object.assign(pluginSetting, oldPluginSettings);
//                 }

//                 if (!oldPluginSettings) {
//                     globalSettings.plugins[pluginInstance.name] =
//                         pluginInstance.settings;
//                     this.globalSettings.mutate(globalSettings);
//                 }

//                 this.#plugins.push(pluginInstance);
//                 logger.info(`Plugin ${pluginInstance.name} loaded.`);
//             }
//         }
//     }

//     async start(): Promise<void> {
//         if (!this.isInitApp) {
//             await this.init();
//         }
//         this.#changeCode(0);
//         logger.info("Start process update data.");

//         while (this.#updateCode === 0) {
//             const activePlugins = this.#plugins.filter(
//                 (el) => el.settings.enable,
//             );
//             if (activePlugins.length === 0) {
//                 this.#restart(5);
//                 break;
//             }

//             try {
//                 await this.#poeNinjaData.updateData(
//                     this.#poeTradeFetch.leagueName,
//                 );
//                 await this.#poeTradeFetch.updateConfig();
//                 const status = await this.currency.update();
//                 if (status === STATUS_CODE.TRADE_LIMIT) {
//                     this.#restart(30);
//                     break;
//                 }
//                 for (const plugin of activePlugins) {
//                     logger.info(`${plugin.name} START update`);
//                     const status = await plugin.update();
//                     if (STATUS_CODE.TRADE_LIMIT === status) {
//                         this.#restart(30);
//                         break;
//                     }
//                     logger.info(`${plugin.name} END update`);
//                 }
//             } catch (error) {
//                 this.#restart(0);
//                 break;
//             }
//         }
//     }

//     #restart(timeInMin = 30): void {
//         this.#changeCode(1);
//         this.isInitApp = false;
//         logger.info(`Restart after ${timeInMin} min.`);
//         const time = timeInMin * 60000;
//         setTimeout(() => {
//             void this.start();
//         }, time);
//     }
// }
