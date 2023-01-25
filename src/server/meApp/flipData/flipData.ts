import { FlipObjectEntity } from '../flipObject/entity/FlipObjectEntity';
import { fileNames } from '../helpers/workingWithFile/FileNames';
import { WorkingWithFile } from '../helpers/workingWithFile/WorkingWithFile';
import { IFlipDataFileWorks } from './interface/IFlipDataFileWorks';

export class FlipData {
  fileWorks: IFlipDataFileWorks = new WorkingWithFile(fileNames.POE_DATA);

  async init() {
    if (!this.fileWorks.fileExist()) {
      await this.fileWorks.saveJsonInFile([]);
    }
  }

  async getAll() {
    return await this.fileWorks.loadFile();
  }

  async getFlipDataInfo() {
    const flipData = await this.getAll();
    const lastUpdate = (await this.fileWorks.fileInfo()).mtime;

    return { flipData, lastUpdate };
  }

  async update(newFlipObject: FlipObjectEntity) {
    const oldFlipData = await this.fileWorks.loadFile();

    const newFlipData = oldFlipData.map((el) =>
      el.queriesFlipUuid !== newFlipObject.queriesFlipUuid ? el : newFlipObject,
    );

    await this.fileWorks.saveJsonInFile(newFlipData);
    return newFlipData;
  }

  async add(newFlipObject: FlipObjectEntity) {
    const oldFlipData = await this.fileWorks.loadFile();

    const newFlipData = [...oldFlipData, newFlipObject];

    await this.fileWorks.saveJsonInFile(newFlipData);
    return newFlipData;
  }

  async remove(removeFlipObject: FlipObjectEntity) {
    const oldFlipData: FlipObjectEntity[] = await this.fileWorks.loadFile();

    const newFlipData = oldFlipData.filter(
      (el) => el.queriesFlipUuid !== removeFlipObject.queriesFlipUuid,
    );

    await this.fileWorks.saveJsonInFile(newFlipData);
    return newFlipData;
  }
}
