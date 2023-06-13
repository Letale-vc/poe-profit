import { QueriesFlipEntity } from './entity/query.entity';
import * as uuid from 'uuid';
import { NewFlipQueriesType } from './types/NewFlipQueriesType';
import { IFlipQueriesFileWorks } from './interface/IFlipQueriesFileWorks';
import { UpdateFlipQueriesType } from './types/UpdateFlipQueriesType';
import { TradeQueryType } from '../types/TradeQueryType';
import { DeleteFlipQueriesType } from './types/DeleteFlipQueriesType';

export class FlipQueries {
  constructor(private readonly fileWorks: IFlipQueriesFileWorks) {}

  async init() {
    if (!this.fileWorks.fileExist()) {
      await this.fileWorks.saveJsonInFile([]);
    }
  }

  async getAll() {
    return await this.fileWorks.loadFile();
  }

  async getAllToClient() {
    const queries = await this.getAll();

    const newQueries = queries.map((el) => ({
      itemBuying: JSON.stringify(el.itemBuying),
      itemSelling: JSON.stringify(el.itemSelling),
      itemSellingPriceMultiplier: el.itemSellingPriceMultiplier,
      uuid: el.uuid,
    }));
    return newQueries;
  }

  async update(updateQueries: UpdateFlipQueriesType) {
    const parseItemBuying: TradeQueryType = JSON.parse(
      updateQueries.itemBuying,
    );
    const parseItemSelling: TradeQueryType = JSON.parse(
      updateQueries.itemSelling,
    );

    const newQueries = new QueriesFlipEntity();

    newQueries.itemBuying = parseItemBuying;
    newQueries.itemSelling = parseItemSelling;
    newQueries.itemSellingPriceMultiplier =
      updateQueries.itemSellingPriceMultiplier;
    newQueries.uuid = updateQueries.uuid;

    const oldFlipQueries = await this.fileWorks.loadFile();

    const newFlipQueries = oldFlipQueries.map((el) =>
      el.uuid !== updateQueries.uuid ? el : newQueries,
    );

    await this.fileWorks.saveJsonInFile(newFlipQueries);
  }

  async add(queries: NewFlipQueriesType) {
    const parseItemBuying = JSON.parse(queries.itemBuying);
    const parseItemSelling = JSON.parse(queries.itemSelling);

    const newQueries = new QueriesFlipEntity();
    newQueries.itemBuying = parseItemBuying;
    newQueries.itemSelling = parseItemSelling;
    newQueries.itemSellingPriceMultiplier = queries.itemSellingPriceMultiplier;
    newQueries.uuid = uuid.v1();

    const oldFlipQueries = await this.fileWorks.loadFile();

    const newFlipQueries = [...oldFlipQueries, newQueries];

    await this.fileWorks.saveJsonInFile(newFlipQueries);
  }

  async remove(flipQueries: DeleteFlipQueriesType) {
    const oldFlipQueries = await this.fileWorks.loadFile();

    const newFlipQueries = oldFlipQueries.filter(
      (el) => el.uuid !== flipQueries.uuid,
    );

    await this.fileWorks.saveJsonInFile(newFlipQueries);
  }
}
