import { QueriesFlipEntity } from '../../../flipQueries/entity/query.entity';
import { PoeTradeDataItemsResponseType } from '../../../types/response-poe-fetch';
import { TradeQueryType } from '../../../types/TradeQueryType';
import { fileNames } from '../FileNames';

export interface CurrencyQueriesFileType {
  divine: TradeQueryType;
  exalted: TradeQueryType;
}

export type ReturnFileType<T> = T extends typeof fileNames.CURRENCY_QUERIES
  ? CurrencyQueriesFileType
  : T extends typeof fileNames.POE_TRADE_DATA_ITEMS
  ? PoeTradeDataItemsResponseType
  : T extends typeof fileNames.POE_DATA
  ? FlipDataFileType
  : T extends typeof fileNames.POE_QUERIES_SEARCH
  ? PoeSearchUrlsFileType
  : unknown;

// export type ReturnFileType =
//   | PoeSearchUrlsFileType
//   | FlipDataFileType
//   | CurrencyQueriesFileType;

export type PoeSearchUrlsFileType = QueriesFlipEntity[];

export type FlipDataFileType = [];
