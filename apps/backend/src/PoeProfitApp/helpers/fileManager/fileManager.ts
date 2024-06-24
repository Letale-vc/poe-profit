import fs from "node:fs";
import fsAsync from "node:fs/promises";
import path from "node:path";
import { Logger } from "../logger.js";
import type { IFileManager } from "../../interface/IFileManager.js";

export class FileManager<T> implements IFileManager<T>  {
      private readonly _fileName: string;
      private readonly _pathFileFolder: string;

    constructor(fileName: string) {
        this._fileName = fileName;
        const dataFolder = path.join(process.cwd(), "data");

        if (!fs.existsSync(dataFolder)) {
            fs.mkdirSync(dataFolder);
        }
        this._pathFileFolder = path.join(dataFolder, this._fileName);
    }

    async init(initValue: T): Promise<boolean> {
        if (!fs.existsSync(this._pathFileFolder)) {
            await this.saveFile(initValue);
        }
        Logger.debug(`Init FileManager file:${this._pathFileFolder}`);
        return true;
    }

    async loadFile(): Promise<T | undefined> {
        try {
            const contents = await fsAsync.readFile(this._pathFileFolder);
            const fileParse = JSON.parse(contents.toString()) as T;
            return fileParse;
        } catch (e) {
            if (e instanceof Error) {
                Logger.error(`Cannot loading file: ${this._pathFileFolder}`);
                Logger.error(e.message);
            }

            return undefined;
        }
    }
    // TODO: maybe I'll do it later
    // async #renameFile(): Promise<void> {
    //     const newPath = path.join(
    //         path.resolve("data"),
    //         this.#fileName.replace(".json", ".old.json"),
    //     );
    //     await fsPromises.rename(this.#pathFileFolder, newPath);
    //     this.#pathFileFolder = newPath;
    // }

    async saveFile(data: T): Promise<void> {
        const stringifyData = JSON.stringify(data, null, 4);
        await fsAsync.writeFile(this._pathFileFolder, stringifyData);
        Logger.debug(`Save file:${this._pathFileFolder}`);
    }


}
