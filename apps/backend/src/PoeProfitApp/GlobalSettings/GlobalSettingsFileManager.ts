import { FileManager } from "../Helpers/WorkingWithFile/WorkingWithFile.js";
import { FILE_NAMES } from "../Helpers/WorkingWithFile/constants.js";
import type { GlobalSettingsType } from "./Types/GlobalSettingsType.js";

export class GlobalSettingsFileManager extends FileManager<GlobalSettingsType> {
    static #instance: GlobalSettingsFileManager;

    settingsCash: GlobalSettingsType | undefined;
    constructor() {
        super(FILE_NAMES.SETTINGS, "object");
    }

    static getInstance(): GlobalSettingsFileManager {
        if (!GlobalSettingsFileManager.#instance) {
            GlobalSettingsFileManager.#instance =
                new GlobalSettingsFileManager();
        }
        return GlobalSettingsFileManager.#instance;
    }

    init(): void {
        if (!this.fileExist()) {
            this.saveFile({
                plugins: [],
            });
        }
        if (this.settingsCash === undefined) {
            this.settingsCash = this.loadFile();
        }
    }

    getSettings(): GlobalSettingsType {
        return this.loadFile();
    }

    mutate(newSettings: GlobalSettingsType): void {
        this.saveFile(newSettings);
        this.settingsCash = newSettings;
    }
}
