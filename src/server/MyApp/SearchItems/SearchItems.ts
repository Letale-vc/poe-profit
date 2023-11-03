import {
  POE_API_FIRST_REQUEST,
  POE_API_SECOND_REQUEST,
  type PoeTradeFetch,
  type PoeSecondResultType,
  type RequestBodyType,
} from 'poe-trade-fetch';

export class SearchItems {
  constructor(readonly poeApi: PoeTradeFetch) {
    this.poeApi = poeApi;
  }

  async makeARequestToAnyItem(requestQuery: RequestBodyType): Promise<{
    result: PoeSecondResultType[];
    id: string;
    total: number;
  }> {
    let delay = this.poeApi.httpRequest.getWaitTime(POE_API_FIRST_REQUEST);
    await this.poeApi.httpRequest.delay(delay);
    const firstResponse = await this.poeApi.firsRequest(requestQuery);
    const { id, result, total } = firstResponse;

    if (total === 0) {
      throw new Error('1');
    }

    const howManyItemsToSkipInTheList = this.howManyItemsToSkipInTheList(total);
    const howMuchToTakeFromTheResult =
      total < 3 ? total : howManyItemsToSkipInTheList + 3;

    const totalTakeResultArray = result.slice(
      howManyItemsToSkipInTheList,
      howMuchToTakeFromTheResult,
    );

    delay = this.poeApi.httpRequest.getWaitTime(POE_API_SECOND_REQUEST);
    await this.poeApi.httpRequest.delay(delay);
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
