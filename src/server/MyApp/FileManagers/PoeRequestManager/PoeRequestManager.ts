import {
  type UpdateRequestType,
  type DeleteRequestType,
  type NewRequestType,
} from './Types/MutateRequestType';
import { type FileNamesType, WorkingWithFile } from '../../Helpers';
import { RequestObject } from './Entity/RequestObject';
import { ApError } from '../../Error/PoeFlipError';
import { type PoeTradeFetch, type RequestBodyType } from 'poe-trade-fetch';
import { type ObjectRequestType } from './Types/ObjectRequestType';
import { type SearchStateType } from 'poe-trade-fetch/Types/PageStates';
import { type SettingsFileManager } from '../SettingsFileManager';

export class PoeRequestManager extends WorkingWithFile<ObjectRequestType[]> {
  constructor(
    fileNames: FileNamesType,
    readonly poeApi: PoeTradeFetch,
    readonly settings: SettingsFileManager,
  ) {
    super(fileNames);
  }

  async getAll() {
    return await this.loadFile();
  }

  private async getPoesessid() {
    await this.settings.updateCash();
    return this.settings.settingsCash.poesessid;
  }
  async update(updateRequest: UpdateRequestType) {
    const poesessid = await this.getPoesessid();
    const requestData = await this.getAll();
    let updateStatus = false;
    const updateRequestData: RequestObject[] = [];
    for (const val of requestData) {
      if (updateRequest.uuid === val.uuid) {
        updateStatus = true;
        const buyingPage = await this.poeApi.getTradePage(
          updateRequest.itemBuying,
          poesessid,
        );
        const buyingRequestBody = this.createSearchRequestBody(buyingPage);
        const sellingPage = await this.poeApi.getTradePage(
          updateRequest.itemSelling,
          poesessid,
        );
        const sellingRequestBody = this.createSearchRequestBody(sellingPage);
        const request = new RequestObject(
          updateRequest,
          buyingRequestBody,
          sellingRequestBody,
          this.poeApi.leagueName,
        );
        updateRequestData.push(request);
      } else {
        updateRequestData.push(val);
      }
    }

    if (updateStatus) {
      await this.saveJsonInFile(updateRequestData);
    }
  }

  async add(newRequest: NewRequestType) {
    try {
      const poesessid = await this.getPoesessid();
      const buyingPage = await this.poeApi.getTradePage(
        newRequest.itemBuying,
        poesessid,
      );
      const buyingRequestBody = this.createSearchRequestBody(buyingPage);
      const sellingPage = await this.poeApi.getTradePage(
        newRequest.itemSelling,
        poesessid,
      );
      const sellingRequestBody = this.createSearchRequestBody(sellingPage);
      const request = new RequestObject(
        newRequest,
        buyingRequestBody,
        sellingRequestBody,
        this.poeApi.leagueName,
      );
      const oldRequestData = await this.loadFile();
      const updatedRequestData = [...oldRequestData, { ...request }];
      await this.saveJsonInFile(updatedRequestData);
    } catch (err) {
      throw new ApError(err);
    }
  }
  private createSearchRequestBody(page: string): RequestBodyType {
    const { state } = this.poeApi.getPoeTradePageState<SearchStateType>(page);
    return {
      query: state,
      sort: { price: 'asc' },
    };
  }
  async remove(uuid: DeleteRequestType) {
    const requestData = await this.loadFile();
    let index = -1;
    for (let i = 0; i < requestData.length; i++) {
      if (requestData[i].uuid === uuid) {
        index = i;
        break;
      }
    }
    if (index !== -1) {
      requestData.splice(index, 1);
      await this.saveJsonInFile(requestData);
    }
  }
}
