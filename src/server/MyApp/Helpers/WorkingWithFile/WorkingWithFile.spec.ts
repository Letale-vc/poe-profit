import path from 'path';
import { WorkingWithFile } from './WorkingWithFile';
import * as fsPromises from 'fs/promises';
import fs, { type Stats } from 'fs';
import { type AllTypeDataFiles, type FileNamesType } from './Types/FilesType';
jest.mock('fs/promises');
jest.mock('fs');

describe('WorkingWithFile', () => {
  const pathFolder = path.resolve('data');
  const originalFilePath = path.join(pathFolder, 'test.json');

  // Видалити тестовий файл після завершення тестів
  afterAll(async () => {
    await fsPromises.unlink(originalFilePath); // Видаляємо тестовий файл
    jest.clearAllMocks();
  });
  const workingWithFile = new WorkingWithFile('test.json' as FileNamesType);

  describe('loadFile', () => {
    it('should load file and parse its contents', async () => {
      const testData = { foo: 'bar' };
      jest
        .spyOn(fsPromises, 'readFile')
        .mockResolvedValue(JSON.stringify(testData));

      const contents = await workingWithFile.loadFile();
      expect(contents).toBeDefined();
    });
  });

  describe('saveJsonInFile', () => {
    it('should be call function with the correct arguments', async () => {
      const writeFileMock = jest
        .spyOn(fsPromises, 'writeFile')
        .mockImplementation();
      const testData = [{ foo: 'bar' }] as unknown as AllTypeDataFiles[];
      await workingWithFile.saveJsonInFile(testData);
      expect(writeFileMock).toHaveBeenCalledWith(
        originalFilePath,
        JSON.stringify(testData, null, 4),
      );
    });
  });

  describe('fileInfo', () => {
    it('should return file information', async () => {
      jest.spyOn(fsPromises, 'stat').mockResolvedValue({} as Stats);

      const fileInfo = await workingWithFile.fileInfo();
      expect(fileInfo).toBeDefined();
    });
  });

  describe('fileExist', () => {
    it('should be call function', () => {
      const existsSyncMock = jest.spyOn(fs, 'existsSync').mockImplementation();
      workingWithFile.fileExist();
      expect(existsSyncMock).toBeCalled();
    });
  });
});
