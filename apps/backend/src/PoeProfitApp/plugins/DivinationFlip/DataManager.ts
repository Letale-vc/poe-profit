import type { FileManager } from "../../helpers/fileManager/fileManager.js";
import type { IDisposable } from "../../interface/IDisposable.js";
import type { DivProfitObject } from "./types/HelpersType.js";

export class DataManager implements IDisposable {
    private _fileManager;
    private _dataCash: Record<string, DivProfitObject> | null = null;
    private _lastUpdateTime: Date | null = null;

    constructor(fileManager: FileManager<Record<string, DivProfitObject>>) {
        this._fileManager = fileManager;
    }

    async loadData(): Promise<void> {
        const fileData = await this._fileManager.loadFile();
        if (fileData !== undefined) {
            this._dataCash = fileData;
        } else {
            this._dataCash = {};
        }
    }

    async getData(): Promise<Record<string, DivProfitObject>> {
        if (this._dataCash !== null) {
            return this._dataCash;
        }

        const fileData = await this._fileManager.loadFile();
        return fileData !== undefined ? fileData : {};
    }

    update(updObj: DivProfitObject): void {
        if (this._dataCash === null) {
            this.loadData();
        }

        if (this._dataCash !== null) {
            this._dataCash[updObj.id] = updObj;
            this._lastUpdateTime = new Date();
        }
    }
    add(newObj: DivProfitObject): void {
        if (this._dataCash === null) {
            this.loadData();
        }

        if (this._dataCash !== null) {
            this._dataCash[newObj.id] = newObj;
            this._lastUpdateTime = new Date();
        }
    }

    remove(id: string): void {
        if (this._dataCash === null) {
            this.loadData();
        }

        if (this._dataCash !== null && id in this._dataCash) {
            delete this._dataCash[id];
            this._lastUpdateTime = new Date();
        }
    }

    dispose(): void {
        if (this._dataCash !== null) {
            this._fileManager.saveFile(this._dataCash);
        }
        this._dataCash = null;
    }
}
