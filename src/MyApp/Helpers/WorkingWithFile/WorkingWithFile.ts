import * as path from 'node:path';
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import { FileNamesType } from './FileNames';

export class WorkingWithFile<T> {
  pathFileFolder: string;

  constructor(fileName: FileNamesType) {
    this._initPathFolder(fileName);
  }

  _initPathFolder(fileName: FileNamesType) {
    const pathFolder = path.resolve('data');
    this.pathFileFolder = path.join(pathFolder, fileName);
  }

  async _initFile(arg?: T) {
    if (!this._fileExist() && arg) {
      await this._saveJsonInFile(arg);
    }
  }

  async _loadFile(): Promise<T> {
    const contents = await fsPromises.readFile(this.pathFileFolder);
    const fileParse = JSON.parse(contents.toString());
    return fileParse;
  }

  async _saveJsonInFile(data: T): Promise<void> {
    const stringifyData = JSON.stringify(data, null, 4);
    return fsPromises.writeFile(this.pathFileFolder, stringifyData);
  }

  async _fileInfo() {
    return fsPromises.stat(this.pathFileFolder);
  }

  _fileExist() {
    return fs.existsSync(this.pathFileFolder);
  }
}
