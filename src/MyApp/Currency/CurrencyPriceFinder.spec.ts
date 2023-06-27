import { PoeSecondResultType } from '../API/Types/ResponsePoeFetch';
import { CurrencyQueriesFileType } from '../Helpers';
import { CurrencyPriceFinder } from './CurrencyPriceFinder';
import { CurrencyPriceFinderSearchItems } from './Interface/CurrencyPriceFinderSearchItems';

// Mock implementation of ICurrencySearchItems for testing purposes
const mockCurrencySearchItems: CurrencyPriceFinderSearchItems = {
  makeARequestToAnyItem: () => {
    // Return mock result
    return Promise.resolve({
      result: [],
      id: '',
      total: 0,
    });
  },
};
const mockCashFileCurrencyQueries: CurrencyQueriesFileType[] = [
  {
    name: 'divine',
    request: {
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
    },
  },
];

describe('Currency', () => {
  let currency: CurrencyPriceFinder;

  beforeEach(() => {
    // Initialize Currency instance with mock dependencies
    currency = new CurrencyPriceFinder(
      mockCurrencySearchItems,
      mockCashFileCurrencyQueries,
    );
  });

  test('should initialize currencyPrice with default values', () => {
    expect(currency.currencyPrice.chaos).toBe(1);
    // Assert other currency prices are also set to 1 or default values
  });

  test('should update currency prices', async () => {
    // Mock search result for each currency
    const searchResult = {
      result: [
        {
          listing: {
            price: {
              type: '',
              amount: 5,
              currency: 'divine',
            },
          },
        },
      ] as PoeSecondResultType[],
      id: '',
      total: 0,
    };

    // Mock makeARequestToAnyItem function to return the search result
    jest
      .spyOn(mockCurrencySearchItems, 'makeARequestToAnyItem')
      .mockResolvedValue(searchResult);

    // Update currency prices
    await currency.update();

    // Assert that currency prices have been updated correctly
    expect(currency.currencyPrice.divine).toBe(5);
    // Assert other currency prices have been updated correctly
  });
});
