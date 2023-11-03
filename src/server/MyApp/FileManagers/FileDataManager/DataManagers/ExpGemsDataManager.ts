import { FILE_NAMES } from '../../../Helpers';
import { DataManager } from '../DataManager';

export class ExpGemsDataManager extends DataManager {
  constructor() {
    super(FILE_NAMES.EXP_GEMS_DATA);
  }
}
