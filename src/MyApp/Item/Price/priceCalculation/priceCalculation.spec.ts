import { PoeSecondResultType } from '../../../API/Types/ResponsePoeFetch';
import { CurrencyPriceMap } from './interface/CurrencyPriceMap';
import { ItemPriceCalculation } from './priceCalculation';

describe('ItemPriceCalculation', () => {
  let itemPriceCalculation: ItemPriceCalculation;
  const currencyPriceInChaos: CurrencyPriceMap = {
    exalted: 10,
    chaos: 1,
    divine: 10,
    'awakened-sextant': 5,
  };

  beforeEach(() => {
    itemPriceCalculation = new ItemPriceCalculation();
    itemPriceCalculation.update(currencyPriceInChaos);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getPricesInChaos', () => {
    it('should calculate prices in chaos for single item', () => {
      const itemsArray = [
        {
          listing: {
            indexed: new Date(),
            price: {
              type: 'price',
              amount: 20,
              currency: 'exalted',
            },
          },
        },
      ] as PoeSecondResultType[];
      const maxStackSize = 1;
      const priceMultiplier = 1;

      const result = itemPriceCalculation.getPricesInChaos(
        itemsArray,
        maxStackSize,
        priceMultiplier,
      );

      expect(result).toEqual({
        itemPriceInChaos: 200,
        fullStackSizeInChaos: 200,
      });
    });

    it('should calculate prices in chaos for multiple items', () => {
      const itemsArray = [
        {
          id: '123',
          listing: {
            indexed: new Date(),
            price: {
              type: 'price',
              amount: 200,
              currency: 'exalted',
            },
          },
        },
        {
          id: '456',
          listing: {
            indexed: new Date(),
            price: {
              type: 'price',
              amount: 300,
              currency: 'exalted',
            },
          },
        },
      ] as PoeSecondResultType[];
      const maxStackSize = 1;
      const priceMultiplier = 1;

      const result = itemPriceCalculation.getPricesInChaos(
        itemsArray,
        maxStackSize,
        priceMultiplier,
      );

      expect(result).toEqual({
        itemPriceInChaos: (500 * 10) / 2,
        fullStackSizeInChaos: (500 * 10) / 2,
      });
    });
  });

  describe('calculatePricesInAllCurrencies', () => {
    it('should calculate prices in all currencies', () => {
      const priceInChaos = 500;
      const maxStackSize = 1;

      const result = itemPriceCalculation.calculatePricesInAllCurrencies(
        priceInChaos,
        maxStackSize,
      );

      expect(result).toEqual({
        exalted: 500 / 10,
        chaos: 500,
        divine: 500 / 10,
        'awakened-sextant': 500 / 5,
      });
    });

    it('should calculate prices in all currencies with custom max stack size', () => {
      const priceInChaos = 500;
      const maxStackSize = 10;

      const result = itemPriceCalculation.calculatePricesInAllCurrencies(
        priceInChaos,
        maxStackSize,
      );

      expect(result).toEqual({
        exalted: (500 * 10) / 10,
        chaos: 500 * 10,
        divine: (500 * 10) / 10,
        'awakened-sextant': (500 * 10) / 5,
      });
    });
  });
});
