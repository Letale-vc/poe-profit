import * as path from 'path';
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import { type FileNamesType } from './Types/FilesType';

export class WorkingWithFile<T> {
  pathFileFolder: string;

  constructor(fileName: FileNamesType) {
    const pathFolder = path.resolve('data');
    this.pathFileFolder = path.join(pathFolder, fileName);
  }

  async initFile(arg: T): Promise<void> {
    if (!this.fileExist()) {
      await this.saveJsonInFile(arg);
    }
  }

  async loadFile(): Promise<T> {
    const contents = await fsPromises.readFile(this.pathFileFolder);
    const fileParse = JSON.parse(contents.toString()) as T;
    return fileParse;
  }

  async saveJsonInFile(data: T): Promise<void> {
    const stringifyData = JSON.stringify(data, null, 4);
    return fsPromises.writeFile(this.pathFileFolder, stringifyData);
  }

  async fileInfo(): Promise<fs.Stats> {
    return fsPromises.stat(this.pathFileFolder);
  }

  fileExist(): boolean {
    return fs.existsSync(this.pathFileFolder);
  }
}
