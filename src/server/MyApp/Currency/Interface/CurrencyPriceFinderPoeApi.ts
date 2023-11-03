import { type ExchangeResponseType } from "poe-trade-fetch/Types/ExchangeResponseType";
import { type TradeExchangeRequestType } from "poe-trade-fetch/Types/TradeExchangeRequestBodyType";

export interface CurrencyPriceFinderPoeApi {
  exchangeRequest: (
    exchangeBody: TradeExchangeRequestType
  ) => Promise<ExchangeResponseType>;
}
