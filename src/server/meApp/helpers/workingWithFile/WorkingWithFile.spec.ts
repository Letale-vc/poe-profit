import { WorkingWithFile } from './WorkingWithFile';
import * as fsPromises from 'fs/promises';

describe('WorkingWithFile', () => {
  const originalFilePath = 'data/poeSearchUrls.json';
  const testFilePath = 'data/poeSearchUrls.test.json';

  // Створити копію початкового файлу перед запуском тестів
  beforeAll(async () => {
    await fsPromises.copyFile(originalFilePath, testFilePath);
  });

  // Видалити тестовий файл після завершення тестів
  afterAll(async () => {
    await fsPromises.copyFile(testFilePath, originalFilePath); // Копіюємо дані назад у початковий файл перед видаленням

    await fsPromises.unlink(testFilePath); // Видаляємо тестовий файл
  });

  const workingWithFile = new WorkingWithFile('poeSearchUrls.json');

  describe('loadFile', () => {
    it('should load file and parse its contents', async () => {
      const contents = await workingWithFile.loadFile();
      expect(contents).toBeDefined();
    });
  });

  describe('saveJsonInFile', () => {
    it('should save JSON data to file', async () => {
      const testData = { foo: 'bar' };

      // Збереження даних у тестовий файл
      await workingWithFile.saveJsonInFile(testData);

      // Перевірка, чи файл був успішно збережений
      const fileContents = await fsPromises.readFile(originalFilePath, 'utf-8');
      const parsedData = JSON.parse(fileContents);

      expect(parsedData).toEqual(testData);
    });
  });

  describe('fileInfo', () => {
    it('should return file information', async () => {
      const fileInfo = await workingWithFile.fileInfo();
      expect(fileInfo).toBeDefined();
    });
  });

  describe('fileExist', () => {
    it('should return true if file exists', () => {
      const fileExists = workingWithFile.fileExist();
      expect(fileExists).toBe(true);
    });
  });
});
