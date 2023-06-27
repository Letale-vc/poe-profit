import { fileNames } from '../../../Helpers';
import { DataManager } from '..';

export class ExpGemsDataManager extends DataManager {
  constructor() {
    super(fileNames.EXP_GEMS_DATA);
  }
}
