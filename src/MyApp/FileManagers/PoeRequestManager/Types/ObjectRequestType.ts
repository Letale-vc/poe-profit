import { TradeRequestType } from '../../../API/Types/TradeRequestType';

export interface ObjectRequestType {
  itemBuying: ItemInRequestType;
  itemSelling: ItemInRequestType;
  uuid: string;
}

export interface ItemInRequestType {
  name: string;
  queryId: string;
  url: string;
  tradeRequest: TradeRequestType;
}
