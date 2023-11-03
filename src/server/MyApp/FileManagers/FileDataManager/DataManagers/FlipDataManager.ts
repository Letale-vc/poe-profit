import { FILE_NAMES } from '../../../Helpers';
import { DataManager } from '../DataManager';

export class FlipDataManager extends DataManager {
  constructor() {
    super(FILE_NAMES.FLIP_DATA);
  }
}
