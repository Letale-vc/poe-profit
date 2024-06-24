import fs from "node:fs";
import path from "node:path";
import { CoreSettings } from "./coreSettings.js";
import { Logger } from "./helpers/logger.js";
import type { IPlugin } from "./interface/IPlugin.js";

export class SettingsContainer {
    private readonly _configDirName = "config";
    private readonly _settingsFileName = "settings.json";
    private readonly _configDirPath = path.join(
        process.cwd(),
        this._configDirName,
    );
    private readonly _settingsFilePath = path.join(
        this._configDirPath,
        this._settingsFileName,
    );
    coreSettings!: CoreSettings;

    constructor() {
        this.loadCoreSettings();
    }

    loadCoreSettings(): void {
        try {
            if (!fs.existsSync(this._configDirPath)) {
                fs.mkdirSync(this._configDirPath);
            }
            if (!fs.existsSync(this._settingsFilePath)) {
                const coreSettings = new CoreSettings();
                fs.writeFileSync(
                    path.join(this._configDirPath, this._settingsFilePath),
                    JSON.stringify(coreSettings),
                );
                this.coreSettings = coreSettings;
            } else {
                const readText = fs.readFileSync(this._settingsFilePath);
                this.coreSettings = JSON.parse(readText.toString());
            }
        } catch (error) {
            if (error instanceof Error) {
                Logger.error(error.message);
                throw error;
            }
        }
    }

    saveCoreSettings(): void {
        try {
            const stringifyObject = JSON.stringify(this.coreSettings, null, 4);
            if (fs.existsSync(this._settingsFilePath)) {
                const stats = fs.statSync(this._settingsFilePath);
                if (stats.size > 1) {
                    const backupFilePath = path.join(
                        this._configDirPath,
                        "dumpSettings.json",
                    );
                    fs.copyFileSync(this._settingsFilePath, backupFilePath);
                }
            }
            fs.writeFileSync(this._settingsFilePath, stringifyObject);
        } catch (error) {
            if (error instanceof Error) {
                Logger.error(error.message);
            }
        }
    }

    saveSettings(plugin: IPlugin): void {
        if (!plugin) return;
        const pluginSettingsPath = path.join(
            this._configDirPath,
            plugin.internalName,
        );
        fs.writeFileSync(
            pluginSettingsPath,
            JSON.stringify(plugin._settings, null, 4),
        );
    }

    loadSettings(plugin: IPlugin): string | undefined {
        const pluginSettingsPath = path.join(
            this._configDirPath,
            plugin.internalName,
        );
        if (!fs.existsSync(pluginSettingsPath)) return undefined;
        const readText = fs.readFileSync(pluginSettingsPath).toString();
        return readText.length === 0 ? undefined : readText;
    }

    static loadSettingsFile<T>(fileName: string): T | undefined {
        const filePath = path.join(__dirname, fileName);

        if (!fs.existsSync(filePath)) {
            Logger.error(`Cannot find ${fileName} file.`);
            return undefined;
        }
        try {
            const fileContent = fs.readFileSync(filePath, "utf8");
            return JSON.parse(fileContent) as T;
        } catch (error) {
            if (error instanceof Error) {
                Logger.error(error.message);
            }
            return undefined;
        }
    }

    static saveSettingsFile<T>(fileName: string, setting: T): void {
        const stringifyObject = JSON.stringify(setting, null, 4);
        fs.writeFileSync(fileName, stringifyObject);
    }
}
