export const fileNames = {
  POE_QUERIES_SEARCH: 'poeSearchUrls.json',
  POE_DATA: 'flipData.json',
  POE_TRADE_DATA_ITEMS: 'poeTradeDataItems.json',
  CURRENCY_QUERIES: 'currencyQueries.json',
} as const;

export type FileNamesType = typeof fileNames[keyof typeof fileNames];
