import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import logger from "../logger.js";

export class FileManager<T> {
    #fileName: string;
    #pathFileFolder: string;

    constructor(fileName: string) {
        this.#fileName = fileName;
        const dataFolder = path.join(process.cwd(), "data");
        const dataFolderUrl = fileURLToPath(new URL(`file://${dataFolder}`));

        if (!fs.existsSync(dataFolderUrl)) {
            fs.mkdirSync(dataFolderUrl);
        }
        this.#pathFileFolder = path.join(dataFolderUrl, this.#fileName);
    }

    init(initValue: T): void {
        if (!this.fileExist()) {
            this.saveFile(initValue);
            logger.debug(`Init file:${this.#pathFileFolder}`);
        }
    }

    loadFile(): T {
        try {
            const contents = fs.readFileSync(this.#pathFileFolder);
            const fileParse = JSON.parse(contents.toString()) as T;
            return fileParse;
        } catch (e) {
            logger.error(`Cannot loading file: ${this.#pathFileFolder}`);
            throw e;
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

    saveFile(data: T): void {
        const stringifyData = JSON.stringify(data, null, 4);
        fs.writeFileSync(this.#pathFileFolder, stringifyData);

        logger.debug(`Save file:${this.#pathFileFolder}`);
    }

    fileInfo(): fs.Stats {
        return fs.statSync(this.#pathFileFolder);
    }

    fileExist(): boolean {
        return fs.existsSync(this.#pathFileFolder);
    }
}
