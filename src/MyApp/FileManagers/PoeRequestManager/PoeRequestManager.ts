import { PoeRequestManagerPoeApi } from './Interface/PoeRequestManagerPoeApi';
import { NewRequestType } from './Types/NewRequestType';
import * as cheerio from 'cheerio';
import { TradeQueryType } from '../../API/Types/TradeRequestType';
import { UpdateRequestType } from './Types/UpdateRequestType';
import { FileNamesType, WorkingWithFile } from '../../Helpers';
import { RequestObject } from './Entity/RequestObject';
import { ObjectRequestType } from './Types/ObjectRequestType';
import { PoeFlipError } from '../../Error/PoeFlipError';
import { SettingsFileManager } from '../SettingsFileManager';

export class PoeRequestManager extends WorkingWithFile<UpdateRequestType[]> {
  constructor(
    fileNames: FileNamesType,
    readonly _poeApi: PoeRequestManagerPoeApi,
    private readonly _settings: SettingsFileManager,
  ) {
    super(fileNames);
  }

  async getAll() {
    return await this._loadFile();
  }

  async _initFile(): Promise<void> {
    super._initFile([]);
  }

  async update(updateRequest: UpdateRequestType) {
    const requestData = await this.getAll();
    let updateStatus = false;

    const updateRequestData = [];
    for (const val of requestData) {
      if (updateRequest.uuid === val.uuid) {
        updateStatus = true;
        const itemBuyingState = await this.takeState(
          updateRequest.itemBuying.queryId,
        );
        const itemSellingState = await this.takeState(
          updateRequest.itemSelling.queryId,
        );
        const request = new RequestObject(
          updateRequest,
          itemBuyingState,
          itemSellingState,
          this._poeApi.leagueName,
        );

        updateRequestData.push(request);
      } else {
        updateRequestData.push(val);
      }
    }

    if (updateStatus) {
      await this._saveJsonInFile(updateRequestData);
    }
  }
  private getPoesessid() {
    const poesessid = this._settings.settingsCash.poesessid; //?
    if (!poesessid) {
      throw new Error('Not Have Poesessid');
    }
    return poesessid;
  }
  private takeState = async (queryId: string): Promise<TradeQueryType> => {
    const poesessid = this.getPoesessid();

    const page = await this._poeApi.tradeSearch(queryId, poesessid);
    const cheerioPage = cheerio.load(page);
    const state = this.searchStateInPage(cheerioPage);

    if (state === undefined) {
      throw new Error('Error page parse');
    }
    return state;
  };

  private searchStateInPage = (
    $: cheerio.CheerioAPI,
  ): TradeQueryType | undefined => {
    let state: TradeQueryType | undefined;
    $('body script').each((i, element) => {
      const scriptContent = $(element).html();
      const match = scriptContent?.match(/t\(([\s\S]*?)\);/);
      if (match) {
        try {
          const jsonString = match[1];
          const data = JSON.parse(jsonString);
          if (!state) state = data.state;
        } catch (e: any) {
          throw new Error('Failed to parse JSON:' + e.message);
        }
      }
    });
    return state;
  };

  async add(newRequest: NewRequestType) {
    try {
      const buyingState = await this.takeState(newRequest.itemBuying);
      const sellingState = await this.takeState(newRequest.itemSelling);
      const request = new RequestObject(
        newRequest,
        buyingState,
        sellingState,
        this._poeApi.leagueName,
      );

      const oldRequestData = await this._loadFile();

      const updatedRequestData = [...oldRequestData, { ...request }];

      await this._saveJsonInFile(updatedRequestData);
    } catch (err) {
      throw new PoeFlipError(err);
    }
  }

  async remove(deletionRequest: ObjectRequestType) {
    const requestData = await this._loadFile();
    let index = -1;

    for (let i = 0; i < requestData.length; i++) {
      if (requestData[i].uuid === deletionRequest.uuid) {
        index = i;
        break;
      }
    }

    if (index !== -1) {
      requestData.splice(index, 1);
      await this._saveJsonInFile(requestData);
    }
  }
}
