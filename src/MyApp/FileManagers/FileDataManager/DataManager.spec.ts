import { Stats } from 'fs';
import { FileNamesType, WorkingWithFile } from '../../Helpers';

import { DataManager } from './DataManager';
import { ObjectProfitDataType } from './Type/InfoObjectDataType';

describe('DataManager', () => {
  let dataManager: DataManager;

  beforeEach(() => {
    // Create an instance of DataManager with a mock file name
    const fileName = 'testFile.json' as FileNamesType;
    dataManager = new DataManager(fileName);
  });

  it('should load data correctly', async () => {
    // Mock the loadFile method of WorkingWithFile
    jest
      .spyOn(WorkingWithFile.prototype, '_loadFile')
      .mockResolvedValueOnce(['data']);

    const result = await dataManager.getData();

    expect(result).toEqual(['data']);
  });

  it('should get data and time info correctly', async () => {
    // Mock the loadFile and fileInfo methods of WorkingWithFile
    jest
      .spyOn(WorkingWithFile.prototype, '_loadFile')
      .mockResolvedValueOnce(['data']);
    jest.spyOn(WorkingWithFile.prototype, '_fileInfo').mockResolvedValueOnce({
      mtime: new Date('2022-01-01'),
    } as unknown as Stats);

    const result = await dataManager.getDataAndTimeInfo();

    expect(result).toEqual({
      data: ['data'],
      lastUpdate: new Date('2022-01-01'),
    });
  });

  it('should update data correctly', async () => {
    // Mock the loadFile and saveJsonInFile methods of WorkingWithFile
    jest
      .spyOn(WorkingWithFile.prototype, '_loadFile')
      .mockResolvedValueOnce([{ requestUuid: '123' }]);
    jest
      .spyOn(WorkingWithFile.prototype, '_saveJsonInFile')
      .mockResolvedValueOnce();

    const updatedObject = {
      requestUuid: '123',
      data: 'updatedData',
    } as unknown as ObjectProfitDataType;

    const result = await dataManager.update(updatedObject);

    expect(result).toEqual([{ requestUuid: '123', data: 'updatedData' }]);
  });

  it('should add new data correctly', async () => {
    // Mock the loadFile and saveJsonInFile methods of WorkingWithFile
    jest
      .spyOn(WorkingWithFile.prototype, '_loadFile')
      .mockResolvedValueOnce([{ requestUuid: '123' }]);
    jest
      .spyOn(WorkingWithFile.prototype, '_saveJsonInFile')
      .mockResolvedValueOnce();

    const newObject = {
      requestUuid: '456',
      data: 'newData',
    } as unknown as ObjectProfitDataType;
    const result = await dataManager.add(newObject);

    expect(result).toEqual([
      { requestUuid: '123' },
      { requestUuid: '456', data: 'newData' },
    ]);
  });

  it('should remove data correctly', async () => {
    // Mock the loadFile and saveJsonInFile methods of WorkingWithFile
    jest
      .spyOn(WorkingWithFile.prototype, '_loadFile')
      .mockResolvedValueOnce([{ requestUuid: '123' } as ObjectProfitDataType]);
    jest
      .spyOn(WorkingWithFile.prototype, '_saveJsonInFile')
      .mockResolvedValueOnce();

    const objectToDelete = { requestUuid: '123' } as ObjectProfitDataType;

    const result = await dataManager.remove(objectToDelete);

    expect(result).toEqual([]);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
