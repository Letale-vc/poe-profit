import {
  type PoeFirstResponseType,
  type PoeSecondResponseType,
  type RateLimitKeys,
  type RequestBodyType,
} from 'poe-trade-fetch';

export interface SearchItemsPoeApi {
  leagueName: string;

  firsRequest: (requestQuery: RequestBodyType) => Promise<PoeFirstResponseType>;
  httpRequest: {
    getWaitTime: (key: RateLimitKeys) => number;
    delay: (time?: number) => Promise<void>;
  };
  secondRequest: (
    arrayIds: string[],
    queryId: string,
  ) => Promise<PoeSecondResponseType>;
}
