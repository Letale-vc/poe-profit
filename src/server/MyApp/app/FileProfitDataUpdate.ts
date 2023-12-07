import { type UPDATE_FILES_NAMES } from '../Helpers';
import { ApError } from '../Error/PoeFlipError';
import {
  type ObjectProfitDataType,
  type DataManager,
  type PoeRequestManager,
  type RequestObject,
} from '../FileManagers';
import { ObjectWithProfit } from '../ObjectWithProfit';
import { type SearchItems } from '../SearchItems';

export class FileDataUpdate {
  cashFileData: ObjectProfitDataType[];
  cashRequestData: RequestObject[];

  constructor(
    readonly fileDataManager: DataManager,
    readonly requestManager: PoeRequestManager,
    private readonly searchItems: SearchItems,
    readonly key: (typeof UPDATE_FILES_NAMES)[number],
  ) {
    this.cashFileData = [];
    this.cashRequestData = [];
  }

  async init() {
    await this.fileDataManager.initFile([]);
    await this.requestManager.initFile([]);
    this.cashFileData = await this.fileDataManager.getData();
    this.cashRequestData = await this.requestManager.getAll();
  }

  // private async cashRequestDataUpdate() {
  //   this.cashRequestData = await this.requestManager.getAll();
  // }

  async dataUpdate() {
    if (this.cashRequestData.length === 0) {
      throw new ApError(null, 555, 'Request Data have 0 requests');
    }

    try {
      this.cashFileData = await this.fileDataManager.getData();
    } catch (err) {
      throw new ApError(err);
    }
    if (this.cashRequestData.length !== 0 && this.cashFileData.length !== 0) {
      await this.removeObjectWithoutRequest();
    }
    for (const val of this.cashRequestData) {
      try {
        const itemBuyingItemFromTrade =
          await this.searchItems.makeARequestToAnyItem(
            val.itemBuying.tradeRequest,
          );
        const itemSellingItemFromTrade =
          await this.searchItems.makeARequestToAnyItem(
            val.itemSelling.tradeRequest,
          );
        const newObject = new ObjectWithProfit(
          itemBuyingItemFromTrade,
          itemSellingItemFromTrade,
          val,
        );
        await this.saveOrUpdateDataInFIle(newObject, val.uuid);
      } catch (err) {
        if (err instanceof Error) {
          if (err.message === '1') {
            continue;
          } else {
            throw new ApError(err);
          }
        } else {
          throw new ApError(err);
        }
      }
    }
  }

  private async saveOrUpdateDataInFIle(
    object: ObjectProfitDataType,
    uuid: string,
  ) {
    const isHaveObjectInCashData = !!this.cashFileData.find(
      (el) => el.requestUuid === uuid,
    );
    if (isHaveObjectInCashData) {
      this.cashFileData = await this.fileDataManager.update(object);
    } else {
      this.cashFileData = await this.fileDataManager.add(object);
    }
  }

  private async removeObjectWithoutRequest() {
    for (const el of this.cashFileData) {
      const searchInRequestData = !!this.cashRequestData.find(
        (value) => value.uuid === el.requestUuid,
      );
      if (searchInRequestData === false) {
        this.cashFileData = await this.fileDataManager.remove(el);
      }
    }
  }
}
