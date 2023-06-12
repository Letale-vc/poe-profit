import { Item } from './item';
import { TradeQueryType } from '../types/TradeQueryType';
import { ItemInfoEntity } from './entity/ItemInfo.entity';
import { IItemPriceCalculation } from './interface/IItemPriceCalculation';
import { IPoeTradeItemInfo } from './interface/IPoeTradeItemInfo';
import { PriceEntity } from '../priceCalculation/entity/PriceEntity';

describe('Item', () => {
  let item: Item;
  const mockLeagueName = 'mock-league';
  const mockItemPrice: IItemPriceCalculation = {
    getItemPrice: jest.fn(),
  };

  beforeEach(() => {
    item = new Item(mockLeagueName, mockItemPrice);
  });

  describe('getPoeTradeLink', () => {
    it('should return the correct PoE Trade link', () => {
      const mockId = 'abc123';
      const expectedLink = `https://www.pathofexile.com/trade/search/${mockLeagueName}/${mockId}`;

      const poeTradeLink = item.getPoeTradeLink(mockId);

      expect(poeTradeLink).toEqual(expectedLink);
    });
  });

  describe('getName', () => {
    it('should return the name when name and type are strings', () => {
      const mockQuery: TradeQueryType = {
        query: {
          name: 'item name',
          type: 'item type',
        },
      };

      const name = item.getName(mockQuery);

      expect(name).toEqual('item name');
    });

    it('should return the type when name is not provided and type is a string', () => {
      const mockQuery: TradeQueryType = {
        query: {
          type: 'item type',
        },
      };

      const name = item.getName(mockQuery);

      expect(name).toEqual('item type');
    });

    it('should return the name option when name is an object with an option', () => {
      const mockQuery: TradeQueryType = {
        query: {
          name: {
            option: 'item option',
          },
        },
      };

      const name = item.getName(mockQuery);

      expect(name).toEqual('item option');
    });

    it('should return the type option when name is not provided and type is an object with an option', () => {
      const mockQuery: TradeQueryType = {
        query: {
          type: {
            option: 'item option',
          },
        },
      };

      const name = item.getName(mockQuery);

      expect(name).toEqual('item option');
    });

    it('should return the term when term is provided', () => {
      const mockQuery: TradeQueryType = {
        query: {
          term: 'item term',
        },
      };

      const name = item.getName(mockQuery);

      expect(name).toEqual('item term');
    });

    it('should return an empty string when none of the conditions are met', () => {
      const mockQuery: TradeQueryType = {
        query: {},
      };

      const name = item.getName(mockQuery);

      expect(name).toEqual('');
    });
  });

  describe('getItemInfo', () => {
    let mockPoeTradeItemInfo: IPoeTradeItemInfo;
    let mockTradeQuery: TradeQueryType;
    let mockPriceMultiplier: number;
    const mockItemName = 'item name';

    beforeEach(() => {
      mockPoeTradeItemInfo = {
        result: [{ item: { maxStackSize: 5 } }],
        id: 'abc123',
        total: 10,
      } as IPoeTradeItemInfo;

      mockTradeQuery = {
        query: {
          name: mockItemName,
        },
      };

      mockPriceMultiplier = 2;
    });

    it('should return the correct item information', () => {
      const mockItemPriceValues = PriceEntity.createDefault();
      mockItemPriceValues.chaos = 100;
      mockItemPriceValues.divine = 10;
      mockItemPriceValues.exalted = 1;
      mockItemPriceValues.priceInChaosIfFullStackSize = 500;
      mockItemPriceValues.priceInDivineIfFullStackSize = 50;
      mockItemPriceValues.priceInExaltedIfFullStackSize = 5;

      const expectedItem: ItemInfoEntity = {
        maxStackSize: 5,
        name: mockItemName,
        poeTradeLink:
          'https://www.pathofexile.com/trade/search/mock-league/abc123',
        totalInTrade: 10,
        price: mockItemPriceValues,
      };
      jest
        .spyOn(mockItemPrice, 'getItemPrice')
        .mockReturnValue(mockItemPriceValues);

      const itemInfo = item.getItemInfo(
        mockPoeTradeItemInfo,
        mockTradeQuery,
        mockPriceMultiplier,
      );

      expect(itemInfo).toEqual(expectedItem);
      expect(mockItemPrice.getItemPrice).toHaveBeenCalledWith(
        mockPoeTradeItemInfo.result,
        mockPoeTradeItemInfo.total,
        expectedItem.maxStackSize,
        mockPriceMultiplier,
      );
    });
  });
});
