import type { IDisposable } from "../../interface/IDisposable.js";
import type { IFileManager } from "../../interface/IFileManager.js";
import type { GemsExpProfit } from "./Types/HelpersTypes.js";

export class DataManager implements IDisposable {
    private _fileManager;
    private _dataCash: Record<string, GemsExpProfit> | null = null;
    private _lastUpdateTime: Date | null = null;

    constructor(fileManager: IFileManager<Record<string, GemsExpProfit>>) {
        this._fileManager = fileManager;
    }

    async getData(): Promise<Record<string, GemsExpProfit>> {
        if (this._dataCash !== null) {
            return this._dataCash;
        }

        const fileData = await this._fileManager.loadFile();
        return fileData !== undefined ? fileData : {};
    }

    async loadData(): Promise<void> {
        const fileData = await this._fileManager.loadFile();
        if (fileData !== undefined) {
            this._dataCash = fileData;
        } else {
            this._dataCash = {};
        }
    }

  async  update(updObj: GemsExpProfit): Promise<void> {
        if (this._dataCash === null) {
            await this.loadData();
        }

        if (this._dataCash !== null) {
            this._dataCash[updObj.id] = updObj;
            this._lastUpdateTime = new Date();
        }
    }
    async  add(newObj: GemsExpProfit) {
        if (this._dataCash === null) {
            await  this.loadData();
        }

        if (this._dataCash !== null) {
            this._dataCash[newObj.id] = newObj;
            this._lastUpdateTime = new Date();
        }
    }

    async remove(id: string): Promise<void> {
        if (this._dataCash === null) {
            await    this.loadData();
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
