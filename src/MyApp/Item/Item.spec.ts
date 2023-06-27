import { Item } from './Item';
import { PoeTradeItemInfoType } from './Interface/PoeTradeItemInfo';
import { Price } from './Price/Price';

// Mock Price class
const mockPriceInstance = {
  itemPriceInChaos: 10, //  очікуване значення
  fullStackSizeInChaos: 100, //  очікуване значення
};
jest.mock('./Price/Price', () => {
  return {
    Price: jest.fn().mockImplementation(() => mockPriceInstance),
  };
});

describe('Item', () => {
  let item: Item;
  let mockPoeTradeItemInfo: PoeTradeItemInfoType;
  const mockUrl = `https://www.pathofexile.com/trade/search/standard/12345`;

  beforeEach(() => {
    mockPoeTradeItemInfo = {
      result: [
        {
          id: '12345',
          listing: {
            method: 'psapi',
            indexed: new Date(),
            stash: { name: 'Test Stash', x: 1, y: 1 },
            whisper: 'Test Whisper',
            whisper_token: 'abcdef',
            account: {
              name: 'Test Account',
              lastCharacterName: 'Test Character',
              online: { league: 'Standard' },
              language: 'en',
              realm: 'pc',
            },
            price: { type: 'currency', amount: 1, currency: 'chaos' },
          },
          item: {
            verified: true,
            w: 1,
            h: 1,
            icon: 'Test Icon',
            name: 'Test Item',
            typeLine: 'Test Type',
            baseType: 'Test Base Type',
            identified: true,
            ilvl: 1,
            inventoryId: 'Test Inventory',
            socket: 1,
          },
        },
      ],
      id: '12345',
      total: 1,
    };

    item = new Item(mockPoeTradeItemInfo, mockUrl, 'itemName');
  });

  it('should have a maxStackSize value', () => {
    expect(item.maxStackSize).toBe(1);
  });

  it('should have a name value', () => {
    expect(item.name).toBe('itemName');
  });

  it('should have a poeTradeLink value', () => {
    expect(item.poeTradeLink).toBe(mockUrl);
  });

  it('should have a totalInTrade value', () => {
    expect(item.totalInTrade).toBe(1);
  });

  it('should create a Price object with the correct parameters', () => {
    expect(Price).toHaveBeenCalledWith(
      mockPoeTradeItemInfo.result,
      mockPoeTradeItemInfo.total,
      item.maxStackSize,
      1,
    );
  });
});
