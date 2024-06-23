import type { ISettings } from "./interface/ISettings.js";

type OnEnableChanged = (value: boolean) => void;

export abstract class SettingsWrapper implements ISettings {
    static isSettingsClass = true;
    enable = false;
    #observers: OnEnableChanged[] = [];

    // get enable(): boolean {
    //     return this._enable;
    // }

    // set enable(value: boolean) {
    //     if (this._enable !== value) {
    //         this._enable = value;
    //         this._notify(value);
    //     }
    // }

    subscribe(observer: OnEnableChanged): void {
        this.#observers.push(observer);
    }

    private _notify(value: boolean): void {
        for (const observer of this.#observers) {
            observer(value);
        }
    }
}
