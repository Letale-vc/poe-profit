import { fileNames } from '../../../Helpers';
import { DataManager } from '..';

export class FlipDataManager extends DataManager {
  constructor() {
    super(fileNames.POE_DATA);
  }
}
