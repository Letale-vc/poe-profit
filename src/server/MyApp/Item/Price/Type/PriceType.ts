import { type CurrencyNamesType } from '~/server/MyApp/Currency';

export interface PriceType {
  oneItem: CurrencyRateType;
  fullStackSize: CurrencyRateType;
}

export type CurrencyRateType = Record<CurrencyNamesType, number>;
