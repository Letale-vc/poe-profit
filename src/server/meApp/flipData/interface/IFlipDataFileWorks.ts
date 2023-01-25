import { Stats } from 'fs';
import { FlipObjectEntity } from '../../flipObject/entity/FlipObjectEntity';

export interface IFlipDataFileWorks {
  loadFile: () => Promise<FlipObjectEntity[]>;

  saveJsonInFile: (data: FlipObjectEntity[]) => Promise<void>;

  fileInfo: () => Promise<Stats>;

  fileExist: () => boolean;
}
