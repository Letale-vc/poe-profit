import { Stats } from 'fs';
import { QueriesFlipEntity } from '../entity/query.entity';

export interface IFlipQueriesFileWorks {
  loadFile: () => Promise<QueriesFlipEntity[]>;

  saveJsonInFile: (data: QueriesFlipEntity[]) => Promise<void>;

  fileInfo: () => Promise<Stats>;

  fileExist: () => boolean;
}
