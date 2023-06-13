import { FlipQueries } from './FlipQueries';
import { QueriesFlipEntity } from './entity/query.entity';
import { IFlipQueriesFileWorks } from './interface/IFlipQueriesFileWorks';
import { v4 as uuidv4 } from 'uuid';

const mockUuid = 'a1ffe4a0-0872-11ee-9d34-6f5543e0af9b';
jest.mock('uuid', () => ({
  v1: jest.fn(() => mockUuid),
}));

// Створення моків для IFlipQueriesFileWorks
const mockFileWorks: IFlipQueriesFileWorks = {
  fileExist: jest.fn().mockReturnValue(true),
  saveJsonInFile: jest.fn(),
  loadFile: jest.fn(),
  fileInfo: jest.fn(),
};

describe('FlipQueries', () => {
  let flipQueries: FlipQueries;

  beforeEach(() => {
    flipQueries = new FlipQueries(mockFileWorks);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('init', () => {
    it('should not save empty array in file if file already exists', async () => {
      jest.spyOn(mockFileWorks, 'fileExist').mockReturnValue(true);

      await flipQueries.init();
      expect(mockFileWorks.saveJsonInFile).toBeCalledTimes(0);
    });

    it('should save empty array in file if file does not exist', async () => {
      jest.spyOn(mockFileWorks, 'fileExist').mockReturnValue(false);
      await flipQueries.init();
      expect(mockFileWorks.saveJsonInFile).toBeCalledTimes(1);
    });
  });

  describe('getAll', () => {
    it('should load file and return its content', async () => {
      const mockFileContent = [
        { itemBuying: {}, itemSelling: {}, uuid: '123' },
      ] as QueriesFlipEntity[];
      jest.spyOn(mockFileWorks, 'loadFile').mockResolvedValue(mockFileContent);

      const result = await flipQueries.getAll();

      expect(mockFileWorks.loadFile).toHaveBeenCalled();
      expect(result).toEqual(mockFileContent);
    });
  });

  describe('getAllToClient', () => {
    it('should load file and return mapped queries for the client', async () => {
      const mockFileContent = [
        {
          itemBuying: {},
          itemSelling: {},
          itemSellingPriceMultiplier: 1,
          uuid: '123',
        },
      ] as QueriesFlipEntity[];
      const expectedMappedQueries = [
        {
          itemBuying: '{}',
          itemSelling: '{}',
          itemSellingPriceMultiplier: 1,
          uuid: '123',
        },
      ];
      jest.spyOn(mockFileWorks, 'loadFile').mockResolvedValue(mockFileContent);
      const result = await flipQueries.getAllToClient();

      expect(mockFileWorks.loadFile).toHaveBeenCalled();
      expect(result).toEqual(expectedMappedQueries);
    });
  });
  describe('remove', () => {
    it('expect to be call fileWorks.saveJsonInFile with loadFileArray.shift() array', async () => {
      const flipQueriesToRemove = {
        uuid: 'exampleUuid',
      };

      const oldFlipQueries = [
        {
          itemBuying: {},
          itemSelling: {},
          itemSellingPriceMultiplier: 1.0,
          uuid: 'exampleUuid',
        },
      ] as QueriesFlipEntity[];

      const expectedNewFlipQueries: QueriesFlipEntity[] = [];

      jest.spyOn(mockFileWorks, 'loadFile').mockResolvedValue(oldFlipQueries);

      await flipQueries.remove(flipQueriesToRemove);

      expect(mockFileWorks.loadFile).toHaveBeenCalled();
      expect(mockFileWorks.saveJsonInFile).toHaveBeenCalledWith(
        expectedNewFlipQueries,
      );
    });
  });

  describe('update', () => {
    it('should be called with  TestNewArray', async () => {
      const updateQueries = {
        itemBuying: '{"exampleKey": "exampleValue1"}',
        itemSelling: '{"exampleKey": "exampleValue2"}',
        itemSellingPriceMultiplier: 2,
        uuid: 'exampleUuid',
      };

      const oldFlipQueries = [
        {
          itemBuying: {},
          itemSelling: {},
          itemSellingPriceMultiplier: 1.0,
          uuid: 'exampleUuid',
        },
      ] as QueriesFlipEntity[];

      const expectedNewFlipQueries = [
        {
          itemBuying: { exampleKey: 'exampleValue1' },
          itemSelling: { exampleKey: 'exampleValue2' },
          itemSellingPriceMultiplier: 2,
          uuid: 'exampleUuid',
        },
      ];
      jest.spyOn(mockFileWorks, 'loadFile').mockResolvedValue(oldFlipQueries);

      await flipQueries.update(updateQueries);

      expect(mockFileWorks.loadFile).toHaveBeenCalled();
      expect(mockFileWorks.saveJsonInFile).toHaveBeenCalledWith(
        expectedNewFlipQueries,
      );
    });
  });
  describe('add', () => {
    it('should add new flip queries correctly', async () => {
      const queries = {
        itemBuying: '{"exampleKey": "exampleValue1"}',
        itemSelling: '{"exampleKey": "exampleValue2"}',
        itemSellingPriceMultiplier: 2,
      };

      const oldFlipQueries = [
        {
          itemBuying: {},
          itemSelling: {},
          itemSellingPriceMultiplier: 1.0,
          uuid: 'oldUuid',
        },
      ] as QueriesFlipEntity[];

      const expectedNewFlipQueries = [
        ...oldFlipQueries,
        {
          itemBuying: { exampleKey: 'exampleValue1' },
          itemSelling: { exampleKey: 'exampleValue2' },
          itemSellingPriceMultiplier: 2,
          uuid: mockUuid,
        },
      ];

      jest.spyOn(mockFileWorks, 'loadFile').mockResolvedValue(oldFlipQueries);

      await flipQueries.add(queries);

      expect(mockFileWorks.loadFile).toHaveBeenCalled();
      expect(mockFileWorks.saveJsonInFile).toHaveBeenCalledWith(
        expectedNewFlipQueries,
      );
    });
  });
});
