import { Logger } from "../../helpers/logger.js";
import type { IDisposable } from "../../interface/IDisposable.js";
import type { IFileManager } from "../../interface/IFileManager.js";
import type { DivProfitObject } from "./types/HelpersType.js";

export class DataManager implements IDisposable {
    private readonly _fileManager: IFileManager<
        Record<string, DivProfitObject>
    >;
    private _dataCash: Record<string, DivProfitObject> | null = null;
    private _lastUpdateTime: Date | null = null;

    constructor(fileManager: IFileManager<Record<string, DivProfitObject>>) {
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

    async update(updObj: DivProfitObject): Promise<void> {
        if (this._dataCash === null) {
            await this.loadData();
        }

        if (this._dataCash !== null) {
            this._dataCash[updObj.id] = updObj;
            this._lastUpdateTime = new Date();
        }
    }

    async remove(id: string): Promise<void> {
        if (this._dataCash === null) {
            await this.loadData();
        }

        if (this._dataCash !== null && id in this._dataCash) {
            delete this._dataCash[id];
            this._lastUpdateTime = new Date();
        }
    }

    async dispose(): Promise<void> {
        if (this._dataCash !== null) {
            await this._fileManager.saveFile(this._dataCash);
        }
        this._dataCash = null;
    }
}
