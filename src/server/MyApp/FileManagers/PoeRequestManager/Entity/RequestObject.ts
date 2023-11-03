import {
  type UpdateRequestType,
  type NewRequestType,
} from '../Types/MutateRequestType';
import * as uuid from 'uuid';

import {
  type ItemInRequestType,
  type ObjectRequestType,
} from '../Types/ObjectRequestType';
import { type RequestBodyType } from 'poe-trade-fetch';

class ItemInRequest implements ItemInRequestType {
  name: string;
  queryId: string;
  url: string;
  tradeRequest: RequestBodyType;
  constructor(
    request: string | ItemInRequestType,
    requestBody: RequestBodyType,
    leagueName: string,
  ) {
    {
      if (typeof request === 'string') {
        this.queryId = request;
      } else {
        this.queryId = request.queryId;
      }
      this.url = this._getPoeTradeLink(this.queryId, leagueName);

      this.tradeRequest = requestBody;
      this.name = this._findNameInTradeQuery(this.tradeRequest);
    }
  }

  _getPoeTradeLink = (id: string, leagueName: string) => {
    const poeTradeLinkURL = new URL('https://www.pathofexile.com/trade/search');
    poeTradeLinkURL.pathname = `${poeTradeLinkURL.pathname}/${leagueName}/${id}`;
    return poeTradeLinkURL.toString();
  };
  _findNameInTradeQuery = (requestBody: RequestBodyType) => {
    if (!requestBody.query) return '';
    const { name, type, term } = requestBody.query;
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
}

export class RequestObject implements ObjectRequestType {
  itemBuying: ItemInRequestType;
  itemSelling: ItemInRequestType;
  uuid: string;
  constructor(
    request: UpdateRequestType | NewRequestType,
    buyingRequestBody: RequestBodyType,
    sellingRequestBody: RequestBodyType,
    leagueName: string,
  ) {
    const buyingInRequest = new ItemInRequest(
      request.itemBuying,
      buyingRequestBody,
      leagueName,
    );

    this.itemBuying = {
      name: buyingInRequest.name,
      queryId: buyingInRequest.queryId,
      url: buyingInRequest.url,
      tradeRequest: buyingInRequest.tradeRequest,
    };
    const sellingInRequest = new ItemInRequest(
      request.itemSelling,
      sellingRequestBody,
      leagueName,
    );
    this.itemSelling = {
      name: sellingInRequest.name,
      queryId: sellingInRequest.queryId,
      url: sellingInRequest.url,
      tradeRequest: sellingInRequest.tradeRequest,
    };

    if ('uuid' in request) {
      // Якщо request є екземпляром типу UpdateRequestType
      this.uuid = request.uuid;
    } else {
      // Якщо request є екземпляром типу NewRequestType
      this.uuid = uuid.v1();
    }
  }
}
