import type { FileManager } from "../../Helpers/WorkingWithFile/WorkingWithFile.js";
import type { GemsExpProfit } from "./Types/HelpersTypes.js";

export class DataManager {
    #fileManager;
    constructor(fileManager: FileManager<Record<string, GemsExpProfit>>) {
        this.#fileManager = fileManager;
    }
    getData() {
        return this.#fileManager.loadFile();
    }
    lastUpdateTime(): Date {
        return this.#fileManager.fileInfo().mtime;
    }
    getDataAndTimeInfo() {
        const data = this.#fileManager.loadFile();
        const lastUpdate = this.lastUpdateTime();
        return { data, lastUpdate };
    }
    update(updObj: GemsExpProfit) {
        const actualData = this.#fileManager.loadFile();
        actualData[updObj.id] = updObj;
        this.#fileManager.saveFile(actualData);
    }
    add(newObj: GemsExpProfit) {
        const actualData = this.#fileManager.loadFile();
        actualData[newObj.id] = newObj;
        this.#fileManager.saveFile(actualData);
    }

    remove(id: string) {
        const actualData = this.#fileManager.loadFile();
        if (id in actualData) delete actualData[id];
        this.#fileManager.saveFile(actualData);
    }
}
