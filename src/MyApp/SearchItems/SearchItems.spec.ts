import { SearchItems } from './SearchItems';

jest.mock('../helpers/utils', () => ({
  delay: jest.fn().mockResolvedValue(10),
}));

// Підміна об'єкта poeApi для тестування
const mockPoeApi = {
  leagueName: 'standard',
  firsRequest: jest.fn(),
  secondRequest: jest.fn(),
};

describe('SearchItems', () => {
  let searchItems: SearchItems;

  beforeEach(() => {
    // Ініціалізувати SearchItems з підмінним poeApi
    searchItems = new SearchItems(mockPoeApi);
  });

  afterEach(() => {
    // Очистити мок-функції після кожного тесту
    jest.clearAllMocks();
  });

  describe('makeARequestToAnyItem', () => {
    it('should throw an error if total is 0', async () => {
      const requestQuery = {
        query: {
          status: {
            option: 'online',
          },
          type: 'Divine Orb',
          stats: [
            {
              type: 'and',
              filters: [],
              disabled: true,
            },
          ],
          filters: {
            misc_filters: {
              filters: {
                stack_size: {
                  min: 5,
                },
              },
              disabled: false,
            },
            trade_filters: {
              filters: {
                price: {
                  option: 'chaos',
                },
              },
              disabled: false,
            },
          },
        },
        sort: {
          price: 'asc',
        },
      };

      // Підготовка мок-відповіді
      const firstResponse = {
        id: 'exampleId',
        result: [],
        total: 0,
      };
      mockPoeApi.firsRequest.mockResolvedValue(firstResponse);

      await expect(
        searchItems.makeARequestToAnyItem(requestQuery),
      ).rejects.toThrowError('1');
      expect(mockPoeApi.firsRequest).toHaveBeenCalledWith(requestQuery);
    });

    it('should make the second request with the correct arguments', async () => {
      const requestQuery = {
        query: {
          status: {
            option: 'online',
          },
          type: 'Divine Orb',
          stats: [
            {
              type: 'and',
              filters: [],
              disabled: true,
            },
          ],
          filters: {
            misc_filters: {
              filters: {
                stack_size: {
                  min: 5,
                },
              },
              disabled: false,
            },
            trade_filters: {
              filters: {
                price: {
                  option: 'chaos',
                },
              },
              disabled: false,
            },
          },
        },
        sort: {
          price: 'asc',
        },
      };

      // Підготовка мок-відповіді
      const firstResponse = {
        id: 'exampleId',
        result: ['item1', 'item2', 'item3'],
        total: 3,
      };
      const secondResponse = {
        result: 'exampleResult',
        id: 'exampleId',
        total: 3,
      };
      mockPoeApi.firsRequest.mockResolvedValue(firstResponse);
      mockPoeApi.secondRequest.mockResolvedValue(secondResponse);

      const result = await searchItems.makeARequestToAnyItem(requestQuery);
      expect(result).toEqual({
        result: 'exampleResult',
        id: 'exampleId',
        total: 3,
      });
      expect(mockPoeApi.firsRequest).toHaveBeenCalledWith(requestQuery);
      expect(mockPoeApi.secondRequest).toHaveBeenCalledWith(
        ['item1', 'item2', 'item3'],
        'exampleId',
      );
    });
  });

  describe('howManyItemsToSkipInTheList', () => {
    it('should return 0 if totalList is less than or equal to 50', () => {
      const totalList = 50;
      const result = searchItems.howManyItemsToSkipInTheList(totalList);
      expect(result).toBe(0);
    });

    it('should return 3 if totalList is between 50 and 100', () => {
      const totalList = 75;
      const result = searchItems.howManyItemsToSkipInTheList(totalList);
      expect(result).toBe(3);
    });

    it('should return 5 if totalList is greater than 100', () => {
      const totalList = 150;
      const result = searchItems.howManyItemsToSkipInTheList(totalList);
      expect(result).toBe(5);
    });
  });
});
