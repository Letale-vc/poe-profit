import { type FileNamesType, WorkingWithFile } from '../../Helpers';
import { type ObjectProfitDataType } from './Type/InfoObjectDataType';

export class DataManager extends WorkingWithFile<ObjectProfitDataType[]> {
  constructor(fileNames: FileNamesType) {
    super(fileNames);
  }

  async getData() {
    return await this.loadFile();
  }

  async getDataAndTimeInfo() {
    const data = await this.loadFile();
    const lastUpdate = (await this.fileInfo()).mtime;
    return { data, lastUpdate };
  }
  async update(updatedObject: ObjectProfitDataType) {
    const actualData = await this.loadFile();
    const newData = actualData.map((el) =>
      el.requestUuid !== updatedObject.requestUuid ? el : updatedObject,
    );
    await this.saveJsonInFile(newData);
    return newData;
  }
  async add(newObject: ObjectProfitDataType) {
    const actualData = await this.loadFile();
    const newData = [...actualData, newObject];
    await this.saveJsonInFile(newData);
    return newData;
  }
  async remove(ObjectToDelete: ObjectProfitDataType) {
    const actualData = await this.loadFile();
    const newData = actualData.filter(
      (el) => el.requestUuid !== ObjectToDelete.requestUuid,
    );
    await this.saveJsonInFile(newData);
    return newData;
  }
}
