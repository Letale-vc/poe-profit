import { PoeRequestManager } from './PoeRequestManager';
import { PoeRequestManagerPoeApi } from './Interface/PoeRequestManagerPoeApi';
import { NewRequestType } from './Types/NewRequestType';
import { UpdateRequestType } from './Types/UpdateRequestType';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { FileNamesType, WorkingWithFile } from '../../Helpers';
import { ObjectRequestType } from './Types/ObjectRequestType';
import { v1 as uuidV1 } from 'uuid';
import { SettingsFileManager } from '../SettingsFileManager';

jest.mock('uuid');

const pathTestPage = resolve('tests/testPage.html');
const testPage = readFileSync(pathTestPage, 'utf-8');
let mockPoeApi: PoeRequestManagerPoeApi;

describe('PoeRequestManager', () => {
  let manager: PoeRequestManager;
  const fileName = 'testFile.json' as FileNamesType;
  const settingsMock: SettingsFileManager = {
    settingsCash: {
      expGemUpdate: true,
      flipUpdate: true,
      poesessid: 'asd',
    },
  } as unknown as SettingsFileManager;
  beforeEach(() => {
    jest.mock('uuid', () => ({
      v1: jest.fn().mockReturnValue('ab002480-9c0b-11ed-b6a3-d918f468e518'),
    }));
    mockPoeApi = {
      leagueName: 'standard',
      tradeDataItems: jest.fn(),
      tradeSearch: jest.fn().mockResolvedValue(testPage),
    };
    manager = new PoeRequestManager(fileName, mockPoeApi, settingsMock);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getAll', () => {
    it('should load and return data from file', async () => {
      const requestData: ObjectRequestType[] = [
        {
          itemBuying: {
            name: '',
            url: 'https://www.pathofexile.com/trade/search/standard/1234',
            queryId: '1234',
            tradeRequest: {
              query: {},
              sort: { price: 'asc' },
            },
          },
          itemSelling: {
            name: '',
            url: 'https://www.pathofexile.com/trade/search/standard/5678',
            queryId: '5678',
            tradeRequest: {
              query: {},
              sort: { price: 'asc' },
            },
          },
          uuid: 'ab002480-9c0b-11ed-b6a3-d918f468e518',
        },
      ];

      jest
        .spyOn(WorkingWithFile.prototype, '_loadFile')
        .mockResolvedValue(requestData);

      const result = await manager.getAll();

      expect(WorkingWithFile.prototype._loadFile).toHaveBeenCalled();
      expect(result).toEqual(requestData);
    });
  });

  describe('update', () => {
    it('should update the specified request', async () => {
      const requestData: ObjectRequestType[] = [
        {
          itemBuying: {
            url: 'https://www.pathofexile.com/trade/search/standard/1234',
            queryId: '1234',
            tradeRequest: {
              query: {},
              sort: { price: 'asc' },
            },
            name: '',
          },
          itemSelling: {
            name: '',
            url: 'https://www.pathofexile.com/trade/search/standard/5678',
            queryId: '5678',
            tradeRequest: {
              query: {},
              sort: { price: 'asc' },
            },
          },
          uuid: 'ab002480-9c0b-11ed-b6a3-d918f468e518',
        },
      ];

      const updateRequest: UpdateRequestType = {
        uuid: 'ab002480-9c0b-11ed-b6a3-d918f468e518',
        itemBuying: {
          url: 'https://www.pathofexile.com/trade/search/standard/abcd',
          queryId: 'abcd',
          tradeRequest: {
            query: {},
            sort: { price: 'asc' },
          },
          name: '',
        },
        itemSelling: {
          name: '',
          url: 'https://www.pathofexile.com/trade/search/standard/efgh',
          queryId: 'efgh',
          tradeRequest: {
            query: {},
            sort: { price: 'asc' },
          },
        },
      };

      const updatedRequestData: ObjectRequestType[] = [
        {
          itemBuying: {
            name: '',
            url: 'https://www.pathofexile.com/trade/search/standard/abcd',
            queryId: 'abcd',
            tradeRequest: {
              query: {},
              sort: { price: 'asc' },
            },
          },
          itemSelling: {
            name: '',
            url: 'https://www.pathofexile.com/trade/search/standard/efgh',
            queryId: 'efgh',
            tradeRequest: {
              query: {},
              sort: { price: 'asc' },
            },
          },
          uuid: 'ab002480-9c0b-11ed-b6a3-d918f468e518',
        },
      ];

      jest
        .spyOn(WorkingWithFile.prototype, '_loadFile')
        .mockResolvedValue(requestData);
      jest
        .spyOn(WorkingWithFile.prototype, '_saveJsonInFile')
        .mockImplementation();

      await manager.update(updateRequest);

      expect(WorkingWithFile.prototype._loadFile).toHaveBeenCalled();
      expect(WorkingWithFile.prototype._saveJsonInFile).toHaveBeenCalledWith(
        updatedRequestData,
      );
    });

    it('should not update any request if UUID does not match', async () => {
      const requestData: ObjectRequestType[] = [
        {
          itemBuying: {
            url: 'https://www.pathofexile.com/trade/search/standard/1234',
            queryId: '1234',
            tradeRequest: {
              query: {},
              sort: { price: 'asc' },
            },
            name: '',
          },
          itemSelling: {
            url: 'https://www.pathofexile.com/trade/search/standard/5678',
            queryId: '5678',
            tradeRequest: {
              query: {},
              sort: { price: 'asc' },
            },
            name: '',
          },
          uuid: 'ab002480-9c0b-11ed-b6a3-d918f468e518',
        },
      ];

      const updateRequest: UpdateRequestType = {
        uuid: '1111',
        itemBuying: {
          url: '',
          queryId: '1234',
          tradeRequest: {
            query: {},
            sort: { price: 'asc' },
          },
          name: '',
        },
        itemSelling: {
          name: '',
          url: 'https://www.pathofexile.com/trade/search/standard/efgh',
          queryId: 'efgh',
          tradeRequest: {
            query: {},
            sort: { price: 'asc' },
          },
        },
      };

      jest
        .spyOn(WorkingWithFile.prototype, '_loadFile')
        .mockResolvedValue(requestData);
      jest
        .spyOn(WorkingWithFile.prototype, '_saveJsonInFile')
        .mockImplementation();
      await manager.update(updateRequest);

      expect(WorkingWithFile.prototype._loadFile).toHaveBeenCalled();
      expect(WorkingWithFile.prototype._saveJsonInFile).not.toHaveBeenCalled();
    });
  });

  describe('add', () => {
    it('should add a new request', async () => {
      (uuidV1 as jest.Mock).mockReturnValue(
        'ab002480-9c0b-11ed-b6a3-d918f468e518',
      );

      const queries: NewRequestType = {
        itemBuying: 'abcd',
        itemSelling: 'efgh',
      };

      const requestData: ObjectRequestType[] = [
        {
          itemBuying: {
            name: '',
            url: 'https://www.pathofexile.com/trade/search/standard/abcd',
            queryId: 'abcd',
            tradeRequest: {
              query: {},
              sort: { price: 'asc' },
            },
          },
          itemSelling: {
            name: '',
            url: 'https://www.pathofexile.com/trade/search/standard/efgh',
            queryId: 'efgh',
            tradeRequest: {
              query: {},
              sort: { price: 'asc' },
            },
          },
          uuid: 'ab002480-9c0b-11ed-b6a3-d918f468e518',
        },
      ];

      jest.spyOn(WorkingWithFile.prototype, '_loadFile').mockResolvedValue([]);

      jest
        .spyOn(WorkingWithFile.prototype, '_saveJsonInFile')
        .mockImplementation();

      await manager.add(queries);

      expect(WorkingWithFile.prototype._loadFile).toHaveBeenCalled();
      expect(WorkingWithFile.prototype._saveJsonInFile).toBeCalledWith(
        requestData,
      );
    });
  });

  describe('remove', () => {
    it('should remove the specified request', async () => {
      const requestData: ObjectRequestType[] = [
        {
          itemBuying: {
            name: '',
            url: 'https://www.pathofexile.com/trade/search/standard/1234',
            queryId: '1234',
            tradeRequest: { query: {}, sort: { price: 'asc' } },
          },
          itemSelling: {
            name: '',
            url: 'https://www.pathofexile.com/trade/search/standard/5678',
            queryId: '5678',
            tradeRequest: {
              query: {},
              sort: { price: 'asc' },
            },
          },
          uuid: 'ab002480-9c0b-11ed-b6a3-d918f468e518',
        },
      ];

      const deletionRequest: ObjectRequestType = {
        itemBuying: {
          name: '',
          url: '',
          queryId: '1234',
          tradeRequest: { query: {}, sort: { price: 'asc' } },
        },
        itemSelling: {
          name: '',
          url: '',
          queryId: '5678',
          tradeRequest: { query: {}, sort: { price: 'asc' } },
        },
        uuid: 'ab002480-9c0b-11ed-b6a3-d918f468e518',
      };

      const updatedRequestData: ObjectRequestType[] = [];

      jest
        .spyOn(WorkingWithFile.prototype, '_loadFile')
        .mockResolvedValue(requestData);

      jest
        .spyOn(WorkingWithFile.prototype, '_saveJsonInFile')
        .mockImplementation();
      await manager.remove(deletionRequest);

      expect(WorkingWithFile.prototype._loadFile).toHaveBeenCalled();
      expect(WorkingWithFile.prototype._saveJsonInFile).toHaveBeenCalledWith(
        updatedRequestData,
      );
    });

    it('should not remove any request if UUID does not match', async () => {
      const requestData: ObjectRequestType[] = [
        {
          itemBuying: {
            name: '',
            url: 'https://www.pathofexile.com/trade/search/standard/1234',
            queryId: '1234',
            tradeRequest: { query: {}, sort: { price: 'asc' } },
          },
          itemSelling: {
            name: '',
            url: 'https://www.pathofexile.com/trade/search/standard/5678',
            queryId: '5678',
            tradeRequest: {
              query: {},
              sort: { price: 'asc' },
            },
          },
          uuid: 'ab002480-9c0b-11ed-b6a3-d918f468e518',
        },
      ];

      const deletionRequest: ObjectRequestType = {
        itemBuying: {
          name: '',
          url: 'https://www.pathofexile.com/trade/search/standard/1234',
          queryId: '1234',
          tradeRequest: {
            query: {},
            sort: { price: 'asc' },
          },
        },
        itemSelling: {
          name: '',
          url: 'https://www.pathofexile.com/trade/search/standard/5678',
          queryId: '5678',
          tradeRequest: {
            query: {},
            sort: { price: 'asc' },
          },
        },
        uuid: '1111',
      };

      jest
        .spyOn(WorkingWithFile.prototype, '_loadFile')
        .mockResolvedValue(requestData);

      jest
        .spyOn(WorkingWithFile.prototype, '_saveJsonInFile')
        .mockImplementation();
      await manager.remove(deletionRequest);

      expect(WorkingWithFile.prototype._loadFile).toHaveBeenCalled();
      expect(WorkingWithFile.prototype._saveJsonInFile).not.toHaveBeenCalled();
    });
  });
});
