import { PoeRequestManager } from './PoeRequestManager';
import {
  type UpdateRequestType,
  type NewRequestType,
} from './Types/MutateRequestType';
import { type FileNamesType, WorkingWithFile } from '../../Helpers';
import { type ObjectRequestType } from './Types/ObjectRequestType';
import { v1 as uuidV1 } from 'uuid';
import { type SettingsFileManager } from '../SettingsFileManager';
import { PoeTradeFetch } from 'poe-trade-fetch';
import {
  type PageStatesType,
  type SearchStateType,
} from 'poe-trade-fetch/Types/PageStates';

jest.mock('uuid');

let mockPoeApi: PoeTradeFetch;

describe('PoeRequestManager', () => {
  let manager: PoeRequestManager;
  const fileName = 'testFile.json' as FileNamesType;
  const settingsMock: SettingsFileManager = {
    getSettings: () => ({
      expGemUpdate: true,
      flipUpdate: true,
      poesessid: '',
    }),
    getPoesessid: () => '1111',
  } as unknown as SettingsFileManager;
  const statePage: PageStatesType<SearchStateType> = {
    tab: 'search',
    realm: 'pc',
    realms: [],
    leagues: [],
    news: {
      trade_news: {
        id: 1642,
        url: '',
        image: '',
      },
    },
    league: 'Ancestor',
    state: {
      stats: [
        {
          type: 'and',
          filters: [],
          disabled: true,
        },
      ],
      status: 'online',
    },
  };
  beforeEach(async () => {
    jest.mock('uuid', () => ({
      v1: jest.fn().mockReturnValue('ab002480-9c0b-11ed-b6a3-d918f468e518'),
    }));
    mockPoeApi = new PoeTradeFetch();
    await mockPoeApi.update();
    jest.spyOn(mockPoeApi, 'getTradeDataItems').mockImplementation();
    jest
      .spyOn(mockPoeApi, 'getPoeTradePageState')
      .mockImplementation(() => statePage);
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

      const loadFileMock = jest
        .spyOn(WorkingWithFile.prototype, 'loadFile')

        .mockResolvedValue(requestData);

      const result = await manager.getAll();

      expect(loadFileMock).toHaveBeenCalled();
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
        itemBuying: 'abcd',
        itemSelling: 'efgh',
      };

      const updatedRequestData: ObjectRequestType[] = [
        {
          itemBuying: {
            name: '',
            url: 'https://www.pathofexile.com/trade/search/Standard/abcd',
            queryId: 'abcd',
            tradeRequest: {
              query: {
                stats: [
                  {
                    type: 'and',
                    filters: [],
                    disabled: true,
                  },
                ],
                status: 'online',
              },
              sort: { price: 'asc' },
            },
          },
          itemSelling: {
            name: '',
            url: 'https://www.pathofexile.com/trade/search/Standard/efgh',
            queryId: 'efgh',
            tradeRequest: {
              query: {
                stats: [
                  {
                    type: 'and',
                    filters: [],
                    disabled: true,
                  },
                ],
                status: 'online',
              },
              sort: { price: 'asc' },
            },
          },
          uuid: 'ab002480-9c0b-11ed-b6a3-d918f468e518',
        },
      ];

      const loadFileMock = jest
        .spyOn(WorkingWithFile.prototype, 'loadFile')

        .mockResolvedValue(requestData);
      const saveJsonInFileMock = jest
        .spyOn(WorkingWithFile.prototype, 'saveJsonInFile')
        .mockImplementation();

      await manager.update(updateRequest);

      expect(loadFileMock).toHaveBeenCalled();
      expect(saveJsonInFileMock).toHaveBeenCalledWith(updatedRequestData);
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
        itemBuying: '1234',
        itemSelling: 'efgh',
      };

      const loadFileMock = jest
        .spyOn(WorkingWithFile.prototype, 'loadFile')

        .mockResolvedValue(requestData);
      const saveJsonInFileMock = jest
        .spyOn(WorkingWithFile.prototype, 'saveJsonInFile')
        .mockImplementation();
      await manager.update(updateRequest);

      expect(loadFileMock).toHaveBeenCalled();
      expect(saveJsonInFileMock).not.toHaveBeenCalled();
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
            url: 'https://www.pathofexile.com/trade/search/Standard/abcd',
            queryId: 'abcd',
            tradeRequest: {
              query: {
                stats: [
                  {
                    type: 'and',
                    filters: [],
                    disabled: true,
                  },
                ],
                status: 'online',
              },
              sort: { price: 'asc' },
            },
          },
          itemSelling: {
            name: '',
            url: 'https://www.pathofexile.com/trade/search/Standard/efgh',
            queryId: 'efgh',
            tradeRequest: {
              query: {
                stats: [
                  {
                    type: 'and',
                    filters: [],
                    disabled: true,
                  },
                ],
                status: 'online',
              },
              sort: { price: 'asc' },
            },
          },
          uuid: 'ab002480-9c0b-11ed-b6a3-d918f468e518',
        },
      ];

      const loadFileMock = jest
        .spyOn(WorkingWithFile.prototype, 'loadFile')

        .mockResolvedValue([]);

      const saveJsonInFileMock = jest
        .spyOn(WorkingWithFile.prototype, 'saveJsonInFile')
        .mockImplementation();

      await manager.add(queries);

      expect(loadFileMock).toHaveBeenCalled();
      expect(saveJsonInFileMock).toBeCalledWith(requestData);
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

      const loadFileMock = jest
        .spyOn(WorkingWithFile.prototype, 'loadFile')

        .mockResolvedValue(requestData);

      const saveJsonInFileMock = jest
        .spyOn(WorkingWithFile.prototype, 'saveJsonInFile')
        .mockImplementation();
      await manager.remove(deletionRequest.uuid);

      expect(loadFileMock).toHaveBeenCalled();
      expect(saveJsonInFileMock).toHaveBeenCalledWith(updatedRequestData);
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

      const loadFileMock = jest
        .spyOn(WorkingWithFile.prototype, 'loadFile')

        .mockResolvedValue(requestData);

      const saveJsonInFileMock = jest
        .spyOn(WorkingWithFile.prototype, 'saveJsonInFile')
        .mockImplementation();
      await manager.remove(deletionRequest.uuid);

      expect(loadFileMock).toHaveBeenCalled();
      expect(saveJsonInFileMock).not.toHaveBeenCalled();
    });
  });
});
