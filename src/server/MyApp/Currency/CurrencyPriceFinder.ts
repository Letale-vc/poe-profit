import { type ExchangeResponseType } from 'poe-trade-fetch/Types/ExchangeResponseType';
import { round } from '../Helpers/Utils';
import { CURRENCY_NAMES, type CurrencyNamesType } from './CurrencyNames';
import { type TradeExchangeRequestType } from 'poe-trade-fetch/Types/TradeExchangeRequestBodyType';
import { POE_API_EXCHANGE_REQUEST, type PoeTradeFetch } from 'poe-trade-fetch';
import { logger } from '../Logger/LoggerPino';

export class CurrencyPriceFinder {
  currencyPrice = new Map<CurrencyNamesType, number>(
    CURRENCY_NAMES.map((el) => [el, 1]),
  );
  private lastUpdateTime;
  constructor(private readonly poeApi: PoeTradeFetch) {
    this.lastUpdateTime = new Date();
    this.lastUpdateTime.setUTCHours(this.lastUpdateTime.getUTCHours() - 1);
  }

  private async searchCurrencyInTrade(): Promise<
    Map<CurrencyNamesType, ExchangeResponseType>
  > {
    const searchCurrencyResults = new Map<
      CurrencyNamesType,
      ExchangeResponseType
    >();
    for (const [key] of this.currencyPrice.entries()) {
      if (key === 'chaos') {
        continue;
      }
      const bodyExchange: TradeExchangeRequestType = {
        query: {
          have: ['chaos'],
          want: [key],
          minimum: 5,
        },
      };
      await this.poeApi.httpRequest.delay(
        this.poeApi.httpRequest.getWaitTime(POE_API_EXCHANGE_REQUEST),
      );
      const result = await this.poeApi.exchangeRequest(bodyExchange);
      searchCurrencyResults.set(key, result);
    }
    return searchCurrencyResults;
  }

  private currencyPriceCalculation(
    listingCurrInTrade: ExchangeResponseType,
  ): number {
    const keys = Object.keys(listingCurrInTrade.result);
    const index = Math.floor(keys.length * 0.4);
    const elementKey = keys[index];
    if (elementKey !== undefined) {
      const elementValue = listingCurrInTrade.result[elementKey];
      if (elementValue?.listing.offers[0]) {
        return round(
          elementValue?.listing.offers[0].exchange.amount /
            elementValue?.listing.offers[0].item.amount,
          0,
        );
      }
    }
    return 1;
  }

  async update() {
    const oneHourAhead = new Date(this.lastUpdateTime);
    oneHourAhead.setUTCHours(oneHourAhead.getUTCHours() + 1);
    if (new Date() < oneHourAhead) {
      logger.info('[Flip app]: Currency SKIP update');
      return;
    }
    logger.info('[Flip app]: Currency START update');
    const searchCurrencyResult = await this.searchCurrencyInTrade();
    for (const [key, val] of searchCurrencyResult.entries()) {
      this.currencyPrice.set(key, this.currencyPriceCalculation(val));
    }
    this.lastUpdateTime = new Date();
    logger.info('[Flip app]: Currency END update');
  }
}
