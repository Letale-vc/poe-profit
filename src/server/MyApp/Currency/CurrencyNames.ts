export const CURRENCY_NAMES = [
  "divine",
  // "exalted",
  // "awakened-sextant",
  "chaos",
] as const;

export type CurrencyNamesType = (typeof CURRENCY_NAMES)[number];

export type CurrencyMapType = Map<CurrencyNamesType, number>;
