import path from 'path';
import { FileNamesType } from './FileNames';
import { WorkingWithFile } from './WorkingWithFile';
import * as fsPromises from 'fs/promises';
import fs, { Stats } from 'fs';
import { AllTypeDataFiles } from '..';
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

      const contents = await workingWithFile._loadFile();
      expect(contents).toBeDefined();
    });
  });

  describe('saveJsonInFile', () => {
    it('should be call function with the correct arguments', async () => {
      const writeFileMock = jest
        .spyOn(fsPromises, 'writeFile')
        .mockImplementation();
      const testData = [{ foo: 'bar' }] as unknown as AllTypeDataFiles[];
      await workingWithFile._saveJsonInFile(testData);
      expect(writeFileMock).toHaveBeenCalledWith(
        originalFilePath,
        JSON.stringify(testData, null, 4),
      );
    });
  });

  describe('fileInfo', () => {
    it('should return file information', async () => {
      jest.spyOn(fsPromises, 'stat').mockResolvedValue({} as Stats);

      const fileInfo = await workingWithFile._fileInfo();
      expect(fileInfo).toBeDefined();
    });
  });

  describe('fileExist', () => {
    it('should be call function', () => {
      const existsSyncMock = jest.spyOn(fs, 'existsSync').mockImplementation();
      workingWithFile._fileExist();
      expect(existsSyncMock).toBeCalled();
    });
  });
});
