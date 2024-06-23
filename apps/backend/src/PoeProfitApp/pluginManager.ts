import fsAsync from "node:fs/promises";
import path from "node:path";
import { Logger } from "./helpers/logger.js";
import type { ISettings } from "./interface/ISettings.js";
import { PluginWrapper } from "./pluginWrapper.js";
import type { PoeDataAggregator } from "./poeDataAggregator.js";
import type { SettingsContainer } from "./settingsContainer.js";
import type { SettingsWrapper } from "./settingsWrapper.js";
import type { Updater } from "./updater.js";

export class PluginManager {
    private readonly pluginsDirName = "plugins";
    private pluginsDirPath = path.join(
        import.meta.dirname,
        this.pluginsDirName,
    );
    private _poeDataAggregator: PoeDataAggregator;
    private _settingsContainer: SettingsContainer;
    public allPluginsLoaded: boolean;
    public plugins = new Array<PluginWrapper>();

    constructor(
        settingsContainer: SettingsContainer,
        poeDataAggregator: PoeDataAggregator,
    ) {
        this._poeDataAggregator = poeDataAggregator;
        this._settingsContainer = settingsContainer;
        this.allPluginsLoaded = false;
    }

    async init(): Promise<void> {
        try {
            const pluginsDirNames = await this._searchPlugins();

            for (const dirName of pluginsDirNames) {
                const pluginDirPath = path.join(this.pluginsDirPath, dirName);
                await this.tryLoadPlugin(pluginDirPath);
            }
            Logger.info("All plugins loaded.");
            this.allPluginsLoaded = true;
        } catch (error) {
            Logger.error("Can't load plugins.");
            this.allPluginsLoaded = false;
        }
    }

    private async _searchPlugins(): Promise<string[]> {
        return fsAsync.readdir(this.pluginsDirPath);
    }

    private async tryLoadPlugin(pluginDirPath: string): Promise<void> {
        try {
            const files = (await fsAsync.readdir(pluginDirPath)).filter(
                (x) => x.endsWith(".ts") || x.endsWith(".js"),
            );

            let classPlugin: {
                new (_: { new (): SettingsWrapper }): Updater;
            } | null = null;
            let pluginSettingsClass: { new (): SettingsWrapper } | null = null;

            for (const file of files) {
                const filePath = path.join(pluginDirPath, file);
                const pluginUrl = new URL(`file://${filePath}`);
                const pluginModule = await import(pluginUrl.toString());
                for (const [_, someElement] of Object.entries(pluginModule)) {
                    if (classPlugin && pluginSettingsClass) {
                        break;
                    }

                    if (
                        typeof someElement === "function" &&
                        "isPluginClass" in someElement
                    ) {
                        Logger.debug(
                            `Found plugin class in module ${pluginUrl}`,
                        );
                        classPlugin = someElement as unknown as {
                            new (_: {
                                new (): ISettings;
                            }): Updater;
                        };
                    }
                    if (
                        typeof someElement === "function" &&
                        "isSettingsClass" in someElement
                    ) {
                        Logger.debug(
                            `Found settings class in module ${pluginUrl}`,
                        );
                        pluginSettingsClass = someElement as unknown as {
                            new (): SettingsWrapper;
                        };
                    }
                    if (classPlugin && pluginSettingsClass) {
                        break;
                    }
                }
            }

            if (!classPlugin) {
                Logger.error(`Not found Plugin class in ${pluginDirPath}`);
                return;
            }
            if (!pluginSettingsClass) {
                Logger.error(`Not found settings class in ${pluginDirPath}.`);
                return;
            }

            const pluginInstance = new classPlugin(pluginSettingsClass);
            const pluginWrapper = new PluginWrapper(pluginInstance);
            pluginWrapper.loadSettings();
            pluginWrapper.onLoad();
            await pluginWrapper.init();
            this.plugins.push(pluginWrapper);
            Logger.info(`Plugin ${pluginInstance.name} loaded.`);
        } catch (error) {
            if (error instanceof Error) {
                Logger.error(
                    `Can't load plugin ${pluginDirPath} error: \n ${error.message}`,
                );
                Logger.error(error.stack?.toString() ?? "");
            }
        }
    }
    closeAllPlugin(): void {
        for (const plugin of this.plugins) {
            plugin.close();
        }
    }
}
