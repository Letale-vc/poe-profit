import * as fs from "fs";
import * as path from "path";
import logger from "../Logger.js";

export class FileManager<T> {
    #fileName: string;
    #pathFileFolder: string;
    #initValue: T;

    constructor(fileName: string, initValue: "object" | "array") {
        this.#fileName = fileName;
        this.#initValue = "object" === initValue ? ({} as T) : ([] as T);
        const projectRoot = process.cwd();
        const dataFolder = path.join(projectRoot, "data");
        if (!fs.existsSync(dataFolder)) {
            fs.mkdirSync(dataFolder);
        }
        this.#pathFileFolder = path.join(dataFolder, fileName);
    }

    init(initValue = this.#initValue): void {
        if (!this.fileExist()) {
            this.saveFile(initValue);
            logger.info(`Init file:${this.#pathFileFolder}`);
        }
    }

    loadFile(): T {
        try {
            const contents = fs.readFileSync(this.#pathFileFolder);
            const fileParse = JSON.parse(contents.toString()) as T;
            return fileParse;
        } catch (e) {
            logger.error(`Error loading file: ${this.#pathFileFolder}`);
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

        logger.info(`Save file:${this.#pathFileFolder}`);
    }

    fileInfo(): fs.Stats {
        return fs.statSync(this.#pathFileFolder);
    }

    fileExist(): boolean {
        return fs.existsSync(this.#pathFileFolder);
    }
}
