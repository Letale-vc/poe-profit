import { CurrencyDataType } from './CurrencyDataType';

export class CurrencyData implements CurrencyDataType {
  [key: string]: number;
  divine: number;
  exalted: number;
  'awakened-sextant': number;
  chaos: number;

  constructor() {
    this.divine = 0;
    this.exalted = 0;
    this['awakened-sextant'] = 0;
    this.chaos = 0;
  }
}
