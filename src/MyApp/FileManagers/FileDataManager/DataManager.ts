import { FileNamesType, WorkingWithFile } from '../../Helpers';
import { ObjectProfitDataType } from './Type/InfoObjectDataType';

export class DataManager extends WorkingWithFile<ObjectProfitDataType[]> {
  constructor(fileNames: FileNamesType) {
    super(fileNames);
  }

  async getData() {
    return await this._loadFile();
  }
  async _initFile(): Promise<void> {
    super._initFile([]);
  }

  async getDataAndTimeInfo() {
    const data = await this._loadFile();
    const lastUpdate = (await this._fileInfo()).mtime;
    return { data, lastUpdate };
  }
  async update(updatedObject: ObjectProfitDataType) {
    const actualData = await this._loadFile();
    const newData = actualData.map((el) =>
      el.requestUuid !== updatedObject.requestUuid ? el : updatedObject,
    );
    await this._saveJsonInFile(newData);
    return newData;
  }
  async add(newObject: ObjectProfitDataType) {
    const actualData = await this._loadFile();
    const newData = [...actualData, newObject];
    await this._saveJsonInFile(newData);
    return newData;
  }
  async remove(ObjectToDelete: ObjectProfitDataType) {
    const actualData = await this._loadFile();
    const newData = actualData.filter(
      (el) => el.requestUuid !== ObjectToDelete.requestUuid,
    );
    await this._saveJsonInFile(newData);
    return newData;
  }
}
