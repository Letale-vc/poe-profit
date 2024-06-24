import type { ISettings } from "./interface/ISettings.js";

export abstract class SettingsWrapper implements ISettings {
    static isSettingsClass = true;
    enable = false;
}
