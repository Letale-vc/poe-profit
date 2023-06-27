import { fileNames } from '../../../Helpers';
import { PoeRequestManager, PoeRequestManagerPoeApi } from '..';
import { ObjectRequestType } from '../Types/ObjectRequestType';
import { TradeRequestType } from '../../../API/Types/TradeRequestType';
import { v1 as uuidV1 } from 'uuid';
import { SettingsFileManager } from '../../SettingsFileManager';

export class ExpGemsRequestManager extends PoeRequestManager {
  constructor(poeApi: PoeRequestManagerPoeApi, settings: SettingsFileManager) {
    super(fileNames.EXP_GEMS_REQUESTS, poeApi, settings);
  }

  async _initFile(): Promise<void> {
    const poeDataItems = await this._poeApi.tradeDataItems();
    const foundObjectGems = poeDataItems.result.find(
      (obj) => obj.id === 'gems',
    );

    if (foundObjectGems) {
      const foundEntries = foundObjectGems.entries.filter((entry) =>
        entry.type.includes('Awakened'),
      );
      if (foundEntries.length > 0) {
        const result = foundEntries.map(({ text }) => {
          const buyingRequest = this._createRequest(text, null, 1);
          const sellingRequest = this._createRequest(text, 5, 5);

          const object: ObjectRequestType = {
            itemBuying: {
              queryId: JSON.stringify(buyingRequest),
              name: text,
              tradeRequest: buyingRequest,
              url: this._createUrl(buyingRequest),
            },
            itemSelling: {
              queryId: JSON.stringify(sellingRequest),
              name: text,
              tradeRequest: sellingRequest,
              url: this._createUrl(sellingRequest),
            },
            uuid: uuidV1(),
          };

          return object;
        });
        await this._saveJsonInFile(result);
      } else {
        await this._saveJsonInFile([]);
      }
    } else {
      await this._saveJsonInFile([]);
    }
  }

  private _createUrl = (tradeRequest: TradeRequestType) => {
    const poeTradeLinkURL = new URL(
      `https://www.pathofexile.com/trade/search/${
        this._poeApi.leagueName
      }?q=${JSON.stringify(tradeRequest)}`,
    );
    return poeTradeLinkURL.toString();
  };

  private _createRequest = (
    itemName: string,
    levelMin: number | null,
    levelMax: number | null,
  ) => {
    return {
      query: {
        status: { option: 'online' },
        type: itemName,
        stats: [{ type: 'and', filters: [], disabled: false }],
        filters: {
          misc_filters: {
            filters: {
              gem_level: { min: levelMin, max: levelMax },
              corrupted: { option: 'false' },
            },
            disabled: false,
          },
        },
      },
      sort: { price: 'asc' },
    };
  };
}
