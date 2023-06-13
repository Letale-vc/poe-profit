import { PoeSecondResultType } from '../../types/response-poe-fetch';

export interface IPoeTradeItemInfo {
  result: PoeSecondResultType[];
  id: string;
  total: number;
}
