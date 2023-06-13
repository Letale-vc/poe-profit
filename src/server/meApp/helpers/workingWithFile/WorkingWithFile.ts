import * as path from 'node:path';
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import { IFlipQueriesFileWorks } from '../../flipQueries/interface/IFlipQueriesFileWorks';
import { FileNamesType } from './FileNames';
import { IFlipDataFileWorks } from '../../flipData/interface/IFlipDataFileWorks';

export class WorkingWithFile<S extends FileNamesType>
  implements IFlipQueriesFileWorks, IFlipDataFileWorks
{
  pathFolder = path.resolve('data');
  pathFileFolder: string;

  constructor(private readonly fileName: S) {
    this.pathFileFolder = this.getPathFolderFile();
  }

  getPathFolderFile(): string {
    return path.join(this.pathFolder, this.fileName);
  }

  async loadFile() {
    const contents = await fsPromises.readFile(this.pathFileFolder);
    const fileParse = JSON.parse(contents.toString());
    return fileParse;
  }

  async saveJsonInFile(data: any): Promise<void> {
    const stringifyData = JSON.stringify(data, null, 4);
    return fsPromises.writeFile(this.pathFileFolder, stringifyData);
  }

  async fileInfo() {
    return fsPromises.stat(this.pathFileFolder);
  }

  fileExist() {
    return fs.existsSync(this.pathFileFolder);
  }
}
