import { PoeApi } from '../API/PoeApi';
import { CurrencyPriceFinder } from '../Currency';
import { fileNames } from '../Helpers/WorkingWithFile/FileNames';
import { CurrencyQueriesFileType } from '../Helpers/WorkingWithFile/Types/FilesType';
import { WorkingWithFile } from '../Helpers/WorkingWithFile/WorkingWithFile';
import { ItemPriceCalculation } from '../Item';
import { SearchItems } from '../SearchItems';
import {
  ExpGemsDataManager,
  ExpGemsRequestManager,
  FlipDataManager,
  FlipRequestManager,
  SettingsFileManager,
} from '../FileManagers';
import { FileDataUpdate } from './FileProfitDataUpdate';
import { PoeFlipError } from '../Error/PoeFlipError';
import { logger } from '../Logger/LoggerPino';

export class App {
  private static instance: App;
  private flipDataUpdater: FileDataUpdate;
  private expGemsDataUpdater: FileDataUpdate;
  private poeApi: PoeApi;
  private cashFileCurrencyQueries: CurrencyQueriesFileType[];
  private updateCode = 0;
  private currency: CurrencyPriceFinder;
  private itemPriceCalculation: ItemPriceCalculation;
  private searchItems: SearchItems;
  private settings: SettingsFileManager;
  private changeCode = (code: number) => {
    this.updateCode = code;
  };

  static async getInstance() {
    if (!App.instance) {
      App.instance = new App();
      await App.instance.init();
    }
    return App.instance;
  }

  private init = async () => {
    this.settings = await SettingsFileManager.getInstance();

    const currencyQueries = new WorkingWithFile<CurrencyQueriesFileType[]>(
      fileNames.CURRENCY_QUERIES,
    );

    this.cashFileCurrencyQueries = await currencyQueries._loadFile();
    this.itemPriceCalculation = ItemPriceCalculation.getInstance();

    this.poeApi = await PoeApi.getInstance();

    this.searchItems = new SearchItems(this.poeApi);

    this.currency = new CurrencyPriceFinder(
      this.searchItems,
      this.cashFileCurrencyQueries,
    );
    await this.flipDataUpdaterInit();
    await this.expGemsDataUpdaterInit();
    logger.info('[Flip app]: initial app success.');
  };

  private async flipDataUpdaterInit() {
    const dataManager = new FlipDataManager();
    const requestManager = new FlipRequestManager(this.poeApi, this.settings);
    this.flipDataUpdater = new FileDataUpdate(
      dataManager,
      requestManager,
      this.searchItems,
    );
    await this.flipDataUpdater.init();
  }
  private async expGemsDataUpdaterInit() {
    const dataManager = new ExpGemsDataManager();
    const requestManager = new ExpGemsRequestManager(
      this.poeApi,
      this.settings,
    );

    this.expGemsDataUpdater = new FileDataUpdate(
      dataManager,
      requestManager,
      this.searchItems,
    );
    await this.expGemsDataUpdater.init();
  }

  start = async () => {
    logger.info('[Flip app]: Start process update data.');
    this.changeCode(0);

    while (this.updateCode === 0) {
      if (this.checkIfDoNotNeedStartUpdate()) {
        logger.warn(
          '[Flip app]: stop process update data. Not have any request. Or disable in settings.',
        );
        this.changeCode(555);
        this.restart(10);
        break;
      }
      try {
        await this.updateCurrencyAndPrice();
        if (this.checkIfCanUpdateFlip()) {
          await this.flipDataUpdater.dataUpdate();
        }
        if (this.checkIfCanUpdateExpGems()) {
          await this.expGemsDataUpdater.dataUpdate();
        }
      } catch (err) {
        if (err instanceof PoeFlipError) {
          if (err.code === 3) {
            logger.warn('[Flip app]: stop process update data.');
            this.changeCode(err.code);
            this.restart();
          }
        }
        logger.warn('[Flip app]: stop process update data.');
        this.changeCode(666);
        this.restart();
        throw new PoeFlipError(err);
      }
    }
  };

  private checkIfDoNotNeedStartUpdate() {
    return !(this.checkIfCanUpdateFlip() || this.checkIfCanUpdateExpGems());
  }
  private checkIfCanUpdateExpGems() {
    return (
      this.expGemsDataUpdater.cashRequestData.length > 0 &&
      this.settings.settingsCash.expGemUpdate
    );
  }
  private checkIfCanUpdateFlip() {
    return (
      this.flipDataUpdater.cashRequestData.length > 0 &&
      this.settings.settingsCash.flipUpdate
    );
  }

  restart = (timeInMin = 15) => {
    logger.info(`'[Flip app]: Restart after ${timeInMin} min.`);
    const time = timeInMin * 60000;
    return setTimeout(this.start, time); // 15 min timeout
  };

  updateCurrencyAndPrice = async () => {
    await this.currency.update();
    this.itemPriceCalculation.update(this.currency.currencyPrice);
  };
}
