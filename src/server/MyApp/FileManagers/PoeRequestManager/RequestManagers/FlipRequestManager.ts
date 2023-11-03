import { FILE_NAMES } from '../../../Helpers';
import { type PoeTradeFetch } from 'poe-trade-fetch';
import { PoeRequestManager } from '../PoeRequestManager';

export class FlipRequestManager extends PoeRequestManager {
  constructor(poeApi: PoeTradeFetch) {
    super(FILE_NAMES.POE_FLIP_REQUESTS, poeApi);
  }
}
