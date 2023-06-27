import { round } from '../Helpers/Utils';
import { PoeSecondResultType } from '../API/Types/ResponsePoeFetch';
import { CurrencyQueriesFileType } from '../Helpers/WorkingWithFile/Types/FilesType';
import { CurrencyPriceFinderSearchItems } from './Interface/CurrencyPriceFinderSearchItems';
import { CurrencyData } from './CurrencyData/CurrencyData';

export class CurrencyPriceFinder {
  currencyPrice;
  constructor(
    private readonly searchItems: CurrencyPriceFinderSearchItems,
    private readonly cashFileCurrencyQueries: CurrencyQueriesFileType[],
  ) {
    this.currencyPrice = new CurrencyData();
    this.cashFileCurrencyQueries.forEach(
      (val) => (this.currencyPrice[val.name] = 1),
    );
    this.currencyPrice.chaos = 1;
  }

  private async searchCurrency() {
    const searchCurrencyResults: SearchCurrencyResultsType = {};
    for (const { name, request } of this.cashFileCurrencyQueries) {
      const result = await this.searchItems.makeARequestToAnyItem(request);
      searchCurrencyResults[name] = result.result;
    }

    return searchCurrencyResults;
  }

  private currencyPriceCalculation(
    listingCurrencyInTrade: PoeSecondResultType[],
  ) {
    const countAllListingPrice = listingCurrencyInTrade.reduce(
      (acc, value) => value.listing.price.amount + acc,
      0,
    );
    const currencyPriceRound = round(
      countAllListingPrice / listingCurrencyInTrade.length,
      0,
    );
    return currencyPriceRound;
  }

  // Обновлення курсу обміну валют у Chaos
  update = async () => {
    try {
      const searchCurrencyResult = await this.searchCurrency();

      Object.keys(searchCurrencyResult).forEach((val) => {
        if (val in this.currencyPrice) {
          this.currencyPrice[val] = this.currencyPriceCalculation(
            searchCurrencyResult[val],
          );
        }
      });
    } catch (err) {
      throw err;
    }
  };
}

interface SearchCurrencyResultsType {
  [key: string]: PoeSecondResultType[];
}
