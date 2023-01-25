import { PoeApi } from '../api/PoeApi';
import { FlipData } from '../flipData/flipData';
import { FlipObjectEntity } from '../flipObject/entity/FlipObjectEntity';
import { FlipObject } from '../flipObject/FlipObject';
import { QueriesFlipEntity } from '../flipQueries/entity/query.entity';
import { FlipQueries } from '../flipQueries/FlipQueries';
import { fileNames } from '../helpers/workingWithFile/FileNames';
import { CurrencyQueriesFileType } from '../helpers/workingWithFile/types/FilesType';
import { WorkingWithFile } from '../helpers/workingWithFile/WorkingWithFile';
import { Item } from '../item/item';
import { PriceCalculation } from '../priceCalculation/priceCalculation';
import { SearchItems } from '../searchItems/searchItems';

export class App {
  flipData: FlipData;
  flipQueries: FlipQueries;
  poeApi: PoeApi;
  searchItems: SearchItems;
  cashFileCurrencyQueries: CurrencyQueriesFileType;
  cashFlipData: FlipObjectEntity[];
  cashFlipQueries: QueriesFlipEntity[];
  updateCode: 0 | 1 = 0;

  changeCode(code: 0 | 1) {
    this.updateCode = code;
  }

  async init() {
    const currencyQueries = new WorkingWithFile(fileNames.CURRENCY_QUERIES);

    this.cashFileCurrencyQueries =
      (await currencyQueries.loadFile()) as unknown as CurrencyQueriesFileType;

    this.poeApi = new PoeApi();
    await this.poeApi.init();

    this.flipData = new FlipData();
    await this.flipData.init();
    this.cashFlipData = await this.flipData.getAll();

    this.flipQueries = new FlipQueries();
    await this.flipQueries.init();
    this.cashFlipQueries = await this.flipQueries.getAll();

    this.searchItems = new SearchItems(this.poeApi);
    console.log('FLIP: INIT SUCCESS');
  }

  async start() {
    console.log('FLIP: START');
    this.changeCode(1);

    while (this.updateCode === 1) {
      await this.updateData();
      if (this.cashFlipQueries.length !== 0 && this.cashFlipData.length !== 0) {
        await this.removeObjectInFlipDataIfNotHaveQueries();
      }
      console.log('FLIP: CYCLE SUCCESS');
    }
  }
  restart(timeInMin = 15) {
    console.log('FLIP: RESTARTING.');
    const time = timeInMin * 60000;
    return setTimeout(this.start.bind(this), time); // 15 min timeout
  }

  async updateData() {
    try {
      this.cashFlipQueries = await this.flipQueries.getAll();
      if (this.cashFlipQueries.length === 0) {
        console.log('FLIP: NOT HAVE SEARCH QUERIES');
        this.changeCode(0);
        this.restart(10);
        return;
      }

      const currencyTradeInfo = await this.searchCurrency();
      const priceCalculation = new PriceCalculation(
        currencyTradeInfo.divineInfo.result,
        currencyTradeInfo.exaltedInfo.result,
      );

      const item = new Item(this.poeApi.leagueName, priceCalculation);
      this.cashFlipData = await this.flipData.getAll();

      for (const value of this.cashFlipQueries) {
        try {
          const itemBuyingItemFromTrade =
            await this.searchItems.makeARequestToAnyItem(value.itemBuying);
          const itemSellingItemFromTrade =
            await this.searchItems.makeARequestToAnyItem(value.itemSelling);
          const flipObject = new FlipObject(
            itemBuyingItemFromTrade,
            itemSellingItemFromTrade,
            value,
            item,
          );
          const isHaveOldFlipObject = !!this.cashFlipData.find(
            (el) => el.queriesFlipUuid === value.uuid,
          );
          if (isHaveOldFlipObject) {
            this.cashFlipData = await this.flipData.update(
              flipObject.getFlipObject(),
            );
          } else {
            this.cashFlipData = await this.flipData.add(
              flipObject.getFlipObject(),
            );
          }
        } catch (err) {
          if (err instanceof Error) {
            if (err.message === '0') {
              console.error('FLIP: RATE LIMIT');
              this.changeCode(0);
              this.restart();
              break;
            }
          }
          console.error(err);
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === '0') {
          console.error('FLIP: RATE LIMIT');
          this.changeCode(0);
          this.restart();
        }
      }
    }
  }

  async searchCurrency() {
    const divineInfo = await this.searchItems.makeARequestToAnyItem(
      this.cashFileCurrencyQueries.divine,
    );
    const exaltedInfo = await this.searchItems.makeARequestToAnyItem(
      this.cashFileCurrencyQueries.exalted,
    );
    return { divineInfo, exaltedInfo };
  }

  async removeObjectInFlipDataIfNotHaveQueries() {
    for (const el of this.cashFlipData) {
      const searchInFlipQueries = !!this.cashFlipQueries.find(
        (value) => value.uuid === el.queriesFlipUuid,
      );
      if (searchInFlipQueries === false) {
        this.cashFlipData = await this.flipData.remove(el);
      }
    }
  }
}
