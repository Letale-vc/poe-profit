export const fileNames = {
  POE_FLIP_REQUESTS: 'poeFlipRequests.json',
  POE_DATA: 'flipData.json',
  POE_TRADE_DATA_ITEMS: 'poeTradeDataItems.json',
  CURRENCY_QUERIES: 'currencyQueries.json',
  EXP_GEMS_DATA: 'ExpGemsData.json',
  EXP_GEMS_REQUESTS: 'ExpGemsRequests.json',
  SETTINGS: 'Settings.json',
} as const;

export type FileNamesType = (typeof fileNames)[keyof typeof fileNames];
