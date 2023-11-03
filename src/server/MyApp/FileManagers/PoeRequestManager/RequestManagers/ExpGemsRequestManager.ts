import { FILE_NAMES } from '../../../Helpers';
import { PoeRequestManager } from '../PoeRequestManager';
import { type ObjectRequestType } from '../Types/ObjectRequestType';
import * as uuid from 'uuid';
import { type PoeTradeFetch, type RequestBodyType } from 'poe-trade-fetch';

export class ExpGemsRequestManager extends PoeRequestManager {
  constructor(poeApi: PoeTradeFetch) {
    super(FILE_NAMES.EXP_GEMS_REQUESTS, poeApi);
  }

  async initFile(): Promise<void> {
    const poeDataItems = await this.poeApi.getTradeDataItems();
    const foundObjectGems = poeDataItems.result.find(
      (obj) => obj.id === 'gems',
    );

    if (foundObjectGems) {
      const foundEntries = foundObjectGems.entries.filter((entry) =>
        entry.type.includes('Awakened'),
      );
      if (foundEntries.length > 0) {
        const result = foundEntries.map(({ text }) => {
          const buyingRequest = this.createRequest(text, null, 1);
          const sellingRequest = this.createRequest(text, 5, 5);

          const object: ObjectRequestType = {
            itemBuying: {
              queryId: JSON.stringify(buyingRequest),
              name: text,
              tradeRequest: buyingRequest,
              url: this.createUrl(buyingRequest),
            },
            itemSelling: {
              queryId: JSON.stringify(sellingRequest),
              name: text,
              tradeRequest: sellingRequest,
              url: this.createUrl(sellingRequest),
            },
            uuid: uuid.v1(),
          };

          return object;
        });
        await this.saveJsonInFile(result);
      } else {
        await this.saveJsonInFile([]);
      }
    } else {
      await this.saveJsonInFile([]);
    }
  }

  private createUrl(tradeRequest: RequestBodyType) {
    const poeTradeLinkURL = new URL(
      `https://www.pathofexile.com/trade/search/${
        this.poeApi.leagueName
      }?q=${JSON.stringify(tradeRequest)}`,
    );
    return poeTradeLinkURL.toString();
  }

  private createRequest(
    itemName: string,
    levelMin: number | null,
    levelMax: number | null,
  ) {
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
  }
}
