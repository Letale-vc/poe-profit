import { PoeSecondResultType } from '../../API/Types/ResponsePoeFetch';

export interface PoeTradeItemInfoType {
  result: PoeSecondResultType[];
  id: string;
  total: number;
}
