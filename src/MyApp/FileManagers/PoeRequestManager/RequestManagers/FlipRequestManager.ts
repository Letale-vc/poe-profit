import { fileNames } from '../../../Helpers';
import { PoeRequestManager, PoeRequestManagerPoeApi } from '..';
import { SettingsFileManager } from '../../SettingsFileManager';

export class FlipRequestManager extends PoeRequestManager {
  constructor(poeApi: PoeRequestManagerPoeApi, _settings: SettingsFileManager) {
    super(fileNames.POE_FLIP_REQUESTS, poeApi, _settings);
  }
}
