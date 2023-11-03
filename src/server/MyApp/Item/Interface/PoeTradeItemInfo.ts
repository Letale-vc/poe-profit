import { type PoeSecondResultType } from 'poe-trade-fetch';

export interface PoeTradeItemInfoType {
  result: PoeSecondResultType[];
  id: string;
  total: number;
}
