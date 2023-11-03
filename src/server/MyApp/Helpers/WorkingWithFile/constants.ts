export const FILE_NAMES = {
  POE_FLIP_REQUESTS: 'poeFlipRequests.json',
  FLIP_DATA: 'flipData.json',
  POE_TRADE_DATA_ITEMS: 'poeTradeDataItems.json',
  EXP_GEMS_DATA: 'expGemsData.json',
  EXP_GEMS_REQUESTS: 'ExpGemsRequests.json',
  SETTINGS: 'Settings.json',
} as const;

export const UPDATE_FILES_NAMES = [
  FILE_NAMES.EXP_GEMS_DATA,
  FILE_NAMES.FLIP_DATA,
] as const;
