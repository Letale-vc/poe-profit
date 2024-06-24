import fs from "node:fs";
import path from "node:path";
import { Logger } from "./helpers/logger.js";
import type { IPlugin } from "./interface/IPlugin.js";
import type { ISettings } from "./interface/ISettings.js";
import { PluginWrapper } from "./pluginWrapper.js";

type PluginClass = {
    new (settingsClass: SettingsClass): IPlugin;
};

type SettingsClass = {
    new (): ISettings;
};

export class PluginManager {
    private readonly pluginsDirName = "plugins";
    private pluginsDirPath = path.join(
        import.meta.dirname,
        this.pluginsDirName,
    );
    public allPluginsLoaded: boolean;
    public plugins = new Array<PluginWrapper>();

    constructor() {
        this.allPluginsLoaded = false;
    }

    async init(): Promise<void> {
        try {
            const pluginsDirNames = this._searchPluginsFolders();

            for (const dirName of pluginsDirNames) {
                const pluginDirPath = path.join(this.pluginsDirPath, dirName);
                await this.tryLoadPlugin(pluginDirPath);
            }

            Logger.info("All plugins loaded.");
            this.allPluginsLoaded = true;
            await this._initPlugins();
            Logger.info("All plugins initialized.");
        } catch (error) {
            Logger.error("Can't load plugins.");
            this.allPluginsLoaded = false;
        }
    }
    private _searchPluginsFolders(): string[] {
        return fs.readdirSync(this.pluginsDirPath);
    }

    private _getPluginFiles(pluginDirPath: string): string[] {
        return fs
            .readdirSync(pluginDirPath)
            .filter(
                (x) =>
                    !x.endsWith("spec.ts") &&
                    (x.endsWith(".ts") || x.endsWith(".js")),
            );
    }

    private async _findPluginClasses(
        files: string[],
        pluginDirPath: string,
    ): Promise<{
        classPlugin: PluginClass | null;
        pluginSettingsClass: SettingsClass | null;
    }> {
        let classPlugin: PluginClass | null = null;
        let pluginSettingsClass: SettingsClass | null = null;

        for (const file of files) {
            const filePath = path.join(pluginDirPath, file);
            const pluginUrl = new URL(`file://${filePath}`);
            const pluginModule = await import(pluginUrl.toString());

            for (const someElement of Object.values(pluginModule)) {
                if (classPlugin && pluginSettingsClass) {
                    break;
                }

                if (typeof someElement !== "function") {
                    continue;
                }

                if ("isPluginClass" in someElement) {
                    Logger.debug(`Found plugin class in module ${pluginUrl}`);
                    classPlugin = someElement as unknown as PluginClass;
                } else if ("isSettingsClass" in someElement) {
                    Logger.debug(`Found settings class in module ${pluginUrl}`);
                    pluginSettingsClass =
                        someElement as unknown as SettingsClass;
                }
            }
        }
        return { classPlugin, pluginSettingsClass };
    }

    private async tryLoadPlugin(pluginDirPath: string): Promise<void> {
        try {
            const files = this._getPluginFiles(pluginDirPath);
            const { classPlugin, pluginSettingsClass } =
                await this._findPluginClasses(files, pluginDirPath);
            if (!classPlugin || !pluginSettingsClass) {
                Logger.debug(`Not found Plugin in ${pluginDirPath}`);
                return;
            }
            this._createPluginInstance(classPlugin, pluginSettingsClass);
        } catch (error) {
            this._logPluginError(pluginDirPath, error);
        }
    }
    private async _initPlugins(): Promise<void> {
        for (const plugin of this.plugins) {
            await plugin.init();
            Logger.info(`Plugin ${plugin.name} initialized.`);
        }
    }

    private _createPluginInstance(
        classPlugin: PluginClass,
        pluginSettingsClass: SettingsClass,
    ): void {
        const pluginInstance = new classPlugin(pluginSettingsClass);
        const pluginWrapper = new PluginWrapper(pluginInstance);
        pluginWrapper.loadSettings();
        this.plugins.push(pluginWrapper);
    }

    private _logPluginError(pluginDirPath: string, error: unknown): void {
        if (error instanceof Error) {
            Logger.error(
                `Can't load plugin ${pluginDirPath} error: \n ${error.message}`,
            );
            Logger.error(error.stack?.toString() ?? "");
        }
    }

    async closeAllPlugin(): Promise<void> {
        for (const plugin of this.plugins) {
            await plugin.close();
        }
    }

    async getAllPluginData(): Promise<Record<string, unknown>> {
        const data: Record<string, unknown> = {};
        for (const plugin of this.plugins) {
            data[plugin.name] = await plugin.getData();
        }
        Logger.log.debug(data);
        return data;
    }
}
