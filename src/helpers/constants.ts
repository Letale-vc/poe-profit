export const TYPE_DATA_NAMES = {
  flipData: 'flipData',
  expGemsData: 'expGemsData',
} as const;
export type DataNamesType = keyof typeof TYPE_DATA_NAMES;
