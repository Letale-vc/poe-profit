import { FILE_NAMES } from '../../../Helpers';
import { type PoeTradeFetch } from 'poe-trade-fetch';
import { PoeRequestManager } from '../PoeRequestManager';
import { type SettingsFileManager } from '../../SettingsFileManager';

export class FlipRequestManager extends PoeRequestManager {
  constructor(poeApi: PoeTradeFetch, settings: SettingsFileManager) {
    super(FILE_NAMES.POE_FLIP_REQUESTS, poeApi, settings);
  }
}
