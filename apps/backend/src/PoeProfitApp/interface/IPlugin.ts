import type { STATUS_CODE } from "../helpers/utils.js";
import type { IDisposable } from "./IDisposable.js";
import type { ISettings } from "./ISettings.js";

export interface IPlugin extends IDisposable {
    internalName: string;
    initialized: boolean;
    _settings: ISettings;
    _loadSettings(): void;
    _saveSettings(): void;
    name: string;
    init(): Promise<boolean> | boolean;
    getAllData(): unknown;
    update(): Promise<STATUS_CODE>;
    onClose(): void;
    onUnload(): void;
    onLoad(): void;
}
