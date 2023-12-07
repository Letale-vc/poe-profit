import { CurrencyPriceFinder } from '../Currency';
import {
  UPDATE_FILES_NAMES as updateFilesNames,
  FILE_NAMES,
  type UPDATE_FILES_NAMES,
} from '../Helpers/WorkingWithFile/constants';
import { ItemPriceCalculation } from '../Item';
import { SearchItems } from '../SearchItems';
import {
  DataManager,
  ExpGemsRequestManager,
  FlipRequestManager,
  type PoeRequestManager,
  SettingsFileManager,
  type SettingsType,
} from '../FileManagers';
import { FileDataUpdate } from './FileProfitDataUpdate';
import { ApError } from '../Error/PoeFlipError';
import { logger } from '../Logger/LoggerPino';
import { PoeTradeFetch, LEAGUES_NAMES } from 'poe-trade-fetch';

export class App {
  isInitApp = false;
  private static instance: App;
  dataUpdaters: FileDataUpdate[] = [];
  private poeApi: PoeTradeFetch;
  private updateCode = 0;
  currency: CurrencyPriceFinder;
  private itemPriceCalculation: ItemPriceCalculation;
  private searchItems: SearchItems;
  settings: SettingsFileManager;
  private changeCode = (code: number) => {
    this.updateCode = code;
  };
  constructor() {
    this.settings = SettingsFileManager.getInstance();
    this.poeApi = PoeTradeFetch.getInstance({
      leagueName: LEAGUES_NAMES.Current,
      realm: 'pc',
    });
    this.searchItems = new SearchItems(this.poeApi);
    this.currency = new CurrencyPriceFinder(this.poeApi);
    this.itemPriceCalculation = ItemPriceCalculation.getInstance();
    updateFilesNames.forEach((val) => {
      const dataManager = new DataManager(val);
      let requestManager: PoeRequestManager;
      if (val === FILE_NAMES.EXP_GEMS_DATA) {
        requestManager = new ExpGemsRequestManager(this.poeApi, this.settings);
      } else {
        requestManager = new FlipRequestManager(this.poeApi, this.settings);
      }
      this.dataUpdaters.push(
        new FileDataUpdate(dataManager, requestManager, this.searchItems, val),
      );
    });
  }
  static countInstance = 0;
  static getInstance() {
    if (!App.instance) {
      App.instance = new App();
      App.countInstance++;
    }
    return App.instance;
  }

  async init() {
    if (this.isInitApp) {
      return;
    }
    await this.settings.init();
    await this.settings.updateCash();
    await this.poeApi.update();
    logger.info(`[Flip app]: POE API: leagueName: ${this.poeApi.leagueName}`);
    for (const updater of this.dataUpdaters) {
      await updater.init();
    }
    this.isInitApp = true;
    logger.info('[Flip app]: initial app success.');
  }

  async start() {
    logger.info('[Flip app]: Start process update data.');
    this.changeCode(0);

    while (this.updateCode === 0) {
      try {
        await this.settings.updateCash();
        await this.poeApi.update();
        if (
          !this.settings.settingsCash.flipUpdate &&
          !this.settings.settingsCash.expGemUpdate
        ) {
          this.restart(1);
          break;
        }
        await this.updateCurrencyPrice();
        for (const updater of this.dataUpdaters) {
          if (this.canUpdateNow(updater)) {
            logger.info(`[Flip app]: ${updater.key} START update`);
            await updater.dataUpdate();
            logger.info(`[Flip app]: ${updater.key} END update`);
          }
        }
      } catch (err) {
        logger.warn('[Flip app]: stop process update data.');
        logger.error(err);
        if (err instanceof Error) {
          if (err.message === 'Rate limit exceeded') {
            this.changeCode(3);
            this.restart();
            break;
          }
        } else if (err instanceof ApError) {
          if (err.code === 3) {
            this.changeCode(err.code);
            this.restart();
            break;
          }
        } else {
          this.changeCode(666);
          this.restart();
          break;
        }
      }
    }
  }

  private canUpdateNow(updater: FileDataUpdate): boolean {
    const keySettings: Record<
      (typeof UPDATE_FILES_NAMES)[number],
      keyof SettingsType
    > = {
      'expGemsData.json': 'expGemUpdate',
      'flipData.json': 'flipUpdate',
    };
    return !!(
      updater.cashRequestData.length > 0 &&
      this.settings.settingsCash[keySettings[updater.key]]
    );
  }

  private restart(timeInMin = 30): void {
    logger.info(`'[Flip app]: Restart after ${timeInMin} min.`);
    const time = timeInMin * 60000;
    setTimeout(() => {
      void this.start();
    }, time);
  }

  private async updateCurrencyPrice() {
    await this.currency.update();
    this.itemPriceCalculation.update(this.currency.currencyPrice);
  }
}
