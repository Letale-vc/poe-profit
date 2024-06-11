import { FileManager } from "../helpers/fileManager/fileManager.js";
import type { SettingsType } from "./types/GlobalSettingsType.js";

export const SETTINGS_FILE_NAME = "settings.json";
const INIT_SETTINGS = { plugins: [] };
export class GlobalSettings {
    static #instance: GlobalSettings;
    #fileManager: FileManager<SettingsType>;
    settingsCash: SettingsType | undefined;

    constructor() {
        this.#fileManager = new FileManager<SettingsType>(SETTINGS_FILE_NAME)
    }

    static getInstance(): GlobalSettings {
        if (!GlobalSettings.#instance) {
            GlobalSettings.#instance =
                new GlobalSettings();
        }
        return GlobalSettings.#instance;
    }

    init(): void {
        this.#fileManager.init(INIT_SETTINGS)
        if (this.settingsCash === undefined) {
            this.settingsCash = this.#fileManager.loadFile();
        }
    }

    getSettings(): SettingsType {
        if (this.settingsCash === undefined) {
            this.settingsCash = this.#fileManager.loadFile();
        }
        return this.settingsCash;
    }

    mutate(newSettings: SettingsType): void {
        this.#fileManager.saveFile(newSettings);
        this.settingsCash = newSettings;
    }
}
