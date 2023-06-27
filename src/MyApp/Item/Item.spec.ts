import { PoeTradeItemInfoType } from './Interface/PoeTradeItemInfo';
import { Item } from './Item';
import { Price } from './Price/Price';
jest.mock('./Price/Price');
afterEach(() => {
  jest.clearAllMocks();
});

describe('Item', () => {
  const poeTradeItemInfo: PoeTradeItemInfoType = {
    result: [
      {
        id: '123456',
        listing: {
          method: 'psapi',
          indexed: new Date(),
          stash: {
            name: 'Test Stash',
            x: 1,
            y: 2,
          },
          whisper: '@testuser Hi, I want to buy your item for 10 chaos',
          whisper_token: 'token',
          account: {
            name: 'testuser',
            lastCharacterName: 'TestCharacter',
            online: { league: 'Standard' },
            language: 'en_US',
            realm: 'pc',
          },
          price: {
            type: '~b/o',
            amount: 10,
            currency: 'chaos',
          },
        },
        item: {
          ilvl: 0,
          inventoryId: '',
          verified: true,
          w: 1,
          h: 1,
          icon: 'https://example.com/icon.png',
          stackSize: 1,
          maxStackSize: 10,
          league: 'Standard',
          id: '123456',
          name: 'Test Item',
          typeLine: 'Test Type',
          baseType: 'Test Base',
          identified: true,
          sockets: [],
          socket: 0,
        },
      },
    ],
    id: '789',
    total: 1,
  };

  const poeTradeLink = 'https://example.com/poetrade';
  const itemName = 'Test Item';

  it('should create an instance of Price with the correct arguments', () => {
    const poeTradeLink = 'https://example.com';
    const itemName = 'Test Item';

    new Item(poeTradeItemInfo, poeTradeLink, itemName);

    expect(Price).toHaveBeenCalledTimes(1);
    expect(Price).toHaveBeenCalledWith(poeTradeItemInfo.result, 1, 10, 1); // Перевірте правильність переданих аргументів
  });

  it('should set the correct values for maxStackSize, name, poeTradeLink, and totalInTrade', () => {
    const item = new Item(poeTradeItemInfo, poeTradeLink, itemName);

    expect(item.maxStackSize).toBe(10);
    expect(item.name).toBe(itemName);
    expect(item.poeTradeLink).toBe(poeTradeLink);
    expect(item.totalInTrade).toBe(1);
  });

  it('should create an instance of Price', () => {
    const item = new Item(poeTradeItemInfo, poeTradeLink, itemName);

    expect(item.price).toBeInstanceOf(Price);
  });

  it('should calculate the correct priceMultiplier when explicitMods are present', () => {
    const poeTradeItemInfoWithExplicitMods: PoeTradeItemInfoType = {
      result: [
        {
          id: '123456',
          listing: {
            method: 'psapi',
            indexed: new Date(),
            stash: {
              name: 'Test Stash',
              x: 1,
              y: 2,
            },
            whisper: '@testuser Hi, I want to buy your item for 10 chaos',
            whisper_token: 'token',
            account: {
              name: 'testuser',
              lastCharacterName: 'TestCharacter',
              online: { league: 'Standard' },
              language: 'en_US',
              realm: 'pc',
            },
            price: {
              type: '~b/o',
              amount: 10,
              currency: 'chaos',
            },
          },
          item: {
            verified: true,
            w: 1,
            h: 1,
            icon: 'https://example.com/icon.png',
            stackSize: 1,
            maxStackSize: 10,
            league: 'Standard',
            id: '123456',
            name: 'Test Item',
            typeLine: 'Test Type',
            baseType: 'Test Base',
            identified: true,
            ilvl: 0,
            explicitMods: ['10x'],
            inventoryId: '',
            sockets: [],
            socket: 0,
          },
        },
      ],
      id: '789',
      total: 1,
    };

    const item = new Item(
      poeTradeItemInfoWithExplicitMods,
      poeTradeLink,
      itemName,
    );

    const priceMultiplier = item.findPriceMultiplier(
      poeTradeItemInfoWithExplicitMods,
    );

    expect(priceMultiplier).toBe(10);
  });
});
