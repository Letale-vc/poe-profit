import { delay } from '../helpers/utils';
import { TradeQueryType } from '../types/TradeQueryType';
import { SearchItemsPoeApi } from './interface/SearchItemsPoeApi.interface';

export class SearchItems {
  constructor(private readonly poeApi: SearchItemsPoeApi) {}

  async makeARequestToAnyItem(requestQuery: TradeQueryType) {
    await delay(); // this delay is needed in order not to get the rate limit. Default 10seconds
    const firstResponse = await this.poeApi.poeFirsRequest(requestQuery);
    const { id, result, total } = firstResponse;
    if (total === 0) {
      throw new Error('1');
    }
    const howManyItemsToSkipInTheList = this.howManyItemsToSkipInTheList(total);
    const howMuchToTakeFromTheResult =
      total < 10 ? total : howManyItemsToSkipInTheList + 10;

    const totalTakeResultArray = result.slice(
      howManyItemsToSkipInTheList,
      howMuchToTakeFromTheResult,
    );
    await delay(); // this delay is needed in order not to get the rate limit. Default 10seconds
    const secondResponse = await this.poeApi.poeSecondRequest(
      totalTakeResultArray,
      id,
    );
    return { result: secondResponse.result, id, total };
  }

  private howManyItemsToSkipInTheList(totalList: number) {
    switch (true) {
      case totalList > 50 && totalList < 100:
        return 3;
      case totalList > 100:
        return 5;
      default:
        return 0;
    }
  }
}
