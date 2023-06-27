import { PoeTradeDataItemsResponseType } from '../../../API/Types/ResponsePoeFetch';
export interface PoeRequestManagerPoeApi {
  leagueName: string;
  tradeDataItems: () => Promise<PoeTradeDataItemsResponseType>;
  tradeSearch: (queryId: string, poesessid: string) => Promise<any>;
}
