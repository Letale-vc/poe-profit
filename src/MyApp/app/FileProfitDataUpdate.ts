import { PoeFlipError } from '../Error/PoeFlipError';
import {
  ObjectProfitDataType,
  DataManager,
  PoeRequestManager,
  RequestObject,
} from '../FileManagers';
import { ObjectWithProfit } from '../ObjectWithProfit';
import { SearchItems } from '../SearchItems';

export class FileDataUpdate {
  cashFileData: ObjectProfitDataType[];
  cashRequestData: RequestObject[];

  constructor(
    private readonly fileDataManager: DataManager,
    private readonly requestManager: PoeRequestManager,
    private readonly searchItems: SearchItems,
  ) {}

  async init() {
    await this.fileDataManager._initFile();
    await this.requestManager._initFile();
    this.cashFileData = await this.fileDataManager.getData();
    this.cashRequestData = await this.requestManager.getAll();
  }

  private async cashRequestDataUpdate() {
    this.cashRequestData = await this.requestManager.getAll();
  }

  async dataUpdate() {
    let error: null | PoeFlipError = null;
    if (this.cashRequestData.length === 0) {
      throw new PoeFlipError(555, 'Request Data have 0 requests');
    }
    try {
      this.cashFileData = await this.fileDataManager.getData();
    } catch (err: any) {
      throw new PoeFlipError(err);
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
        if (err instanceof PoeFlipError) {
          if (err.code === 3) {
            error = new PoeFlipError(err);
            break;
          }
        }
      }
    }

    if (error instanceof PoeFlipError) {
      throw error;
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
