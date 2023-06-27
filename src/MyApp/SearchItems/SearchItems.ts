import { TradeRequestType } from '../API/Types/TradeRequestType';
import { PoeSecondResultType } from '../API/Types/ResponsePoeFetch';
import { SearchItemsPoeApi } from './interface/SearchItemsPoeApi';
import { CurrencyPriceFinderSearchItems } from '../Currency/Interface/CurrencyPriceFinderSearchItems';

export class SearchItems implements CurrencyPriceFinderSearchItems {
  constructor(private readonly poeApi: SearchItemsPoeApi) {}

  async makeARequestToAnyItem(requestQuery: TradeRequestType): Promise<{
    result: PoeSecondResultType[];
    id: string;
    total: number;
  }> {
    // await delay(); // this delay is needed in order not to get the rate limit. Default 10seconds
    const firstResponse = await this.poeApi.firsRequest(requestQuery);
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
    // await delay(); // this delay is needed in order not to get the rate limit. Default 10seconds
    const secondResponse = await this.poeApi.secondRequest(
      totalTakeResultArray,
      id,
    );
    return { result: secondResponse.result, id, total };
  }

  howManyItemsToSkipInTheList(totalList: number) {
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
