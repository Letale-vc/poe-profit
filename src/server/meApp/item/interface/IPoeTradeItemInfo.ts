import { PoeSecondResult } from '../../types/response-poe-fetch';

export interface IPoeTradeItemInfo {
  result: PoeSecondResult[];
  id: string;
  total: number;
}
