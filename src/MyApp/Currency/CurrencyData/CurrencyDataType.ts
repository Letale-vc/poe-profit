import { CurrencyNamesType } from '../../../shared';

export interface CurrencyDataType extends Record<CurrencyNamesType, number> {
  [key: string]: number;
}
