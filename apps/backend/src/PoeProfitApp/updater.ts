import type { STATUS_CODE } from "./helpers/utils.js";
import type { IPlugin } from "./interface/IPlugin.js";
import type { ISettings } from "./interface/ISettings.js";
import type { PoeDataAggregator } from "./poeDataAggregator.js";
import type { SettingsContainer } from "./settingsContainer.js";

export abstract class Updater<T extends ISettings = ISettings>
    implements IPlugin
{
    static isPluginClass = true;
    private static _poeDataAggregator: PoeDataAggregator;
    private static _settingsContainer: SettingsContainer;
    public _settings: ISettings;
    internalName: string;
    name = "";

    get poeDataAggregator() {
        return Updater._poeDataAggregator;
    }

    get _settingsContainer() {
        return Updater._settingsContainer;
    }

    get settings(): T {
        return this._settings as T;
    }

    initialized = false;

    static init(
        poeDataAggregator: PoeDataAggregator,
        settingsContainer: SettingsContainer,
    ): void {
        Updater._poeDataAggregator = poeDataAggregator;
        Updater._settingsContainer = settingsContainer;
    }

    constructor(settingsConstructor: { new (): T }) {
        this._settings = new settingsConstructor();
        this.internalName = this.constructor.name;
        this.name = this.internalName;
    }

    _saveSettings(): void {
        this._settingsContainer.saveSettings(this);
    }

    init(): boolean | Promise<boolean> {
        return true;
    }

    _loadSettings(): void {
        const settings = this._settingsContainer.loadSettings(this);

        if (settings === undefined) {
            return;
        }
        this._settings = Object.assign(this._settings, JSON.parse(settings));
    }

    onLoad(): void {}

    dispose(): void | Promise<void> {
        this.onClose();
    }

    onClose() {
        this._saveSettings();
    }
    onUnload(): void {}

    abstract getAllData(): Promise<unknown>;

    abstract update(): Promise<STATUS_CODE>;
}
