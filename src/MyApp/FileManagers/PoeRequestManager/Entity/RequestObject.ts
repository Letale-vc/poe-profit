import {
  TradeQueryType,
  TradeRequestType,
} from '../../../API/Types/TradeRequestType';
import { NewRequestType } from '../Types/NewRequestType';
import { v1 as uuidV1 } from 'uuid';

import { UpdateRequestType } from '../Types/UpdateRequestType';
import {
  ItemInRequestType,
  ObjectRequestType,
} from '../Types/ObjectRequestType';

class ItemInRequest implements ItemInRequestType {
  name: string;
  queryId: string;
  url: string;
  tradeRequest: TradeRequestType;
  constructor(
    request: string | ItemInRequestType,
    state: TradeQueryType,
    leagueName: string,
  ) {
    {
      if (typeof request === 'string') {
        this.queryId = request;
      } else {
        this.queryId = request.queryId;
      }
      this.url = this._getPoeTradeLink(this.queryId, leagueName);

      this.tradeRequest = this._createTradeRequest(state);
      this.name = this._findNameInTradeQuery(this.tradeRequest);
    }
  }

  _getPoeTradeLink = (id: string, leagueName: string) => {
    const poeTradeLinkURL = new URL('https://www.pathofexile.com/trade/search');
    poeTradeLinkURL.pathname = `${poeTradeLinkURL.pathname}/${leagueName}/${id}`;
    return poeTradeLinkURL.toString();
  };
  _findNameInTradeQuery = (tradeQuery: TradeRequestType) => {
    const { name, type, term } = tradeQuery.query;
    if (typeof name === 'string' && typeof type === 'string') {
      return name;
    }
    if (typeof name === 'string' && !type) {
      return name;
    }
    if (!name && typeof type === 'string') {
      return type;
    }
    if (typeof name === 'object' && name.option) {
      return name.option;
    }
    if (!name && typeof type === 'object' && type.option) {
      return type.option;
    }
    if (!!term) {
      return term;
    }
    return '';
  };
  _createTradeRequest = (query: TradeQueryType) => {
    const tradeRequest: TradeRequestType = {
      query: query,
      sort: { price: 'asc' },
    };
    return tradeRequest;
  };
}

export class RequestObject implements ObjectRequestType {
  itemBuying: any = {
    name: null,
    queryId: null,
    url: null,
    tradeRequest: null,
  };
  itemSelling: any = {
    name: null,
    queryId: null,
    url: null,
    tradeRequest: null,
  };
  uuid: string;
  constructor(
    request: UpdateRequestType | NewRequestType,
    buyingState: TradeQueryType,
    sellingState: TradeQueryType,
    leagueName: string,
  ) {
    const buyingInRequest = new ItemInRequest(
      request.itemBuying,
      buyingState,
      leagueName,
    );
    this.itemBuying.name = buyingInRequest.name;
    this.itemBuying.queryId = buyingInRequest.queryId;
    this.itemBuying.url = buyingInRequest.url;
    this.itemBuying.tradeRequest = buyingInRequest.tradeRequest;

    const sellingInRequest = new ItemInRequest(
      request.itemSelling,
      sellingState,
      leagueName,
    );
    this.itemSelling.name = sellingInRequest.name;
    this.itemSelling.queryId = sellingInRequest.queryId;
    this.itemSelling.url = sellingInRequest.url;
    this.itemSelling.tradeRequest = sellingInRequest.tradeRequest;

    if ('uuid' in request) {
      // Якщо request є екземпляром типу UpdateRequestType
      this.uuid = request.uuid;
    } else {
      // Якщо request є екземпляром типу NewRequestType
      this.uuid = uuidV1();
    }
  }
}
