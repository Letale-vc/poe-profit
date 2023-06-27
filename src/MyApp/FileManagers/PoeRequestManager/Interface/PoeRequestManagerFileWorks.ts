import { Stats } from 'fs';

export interface PoeRequestManagerFileWorks<T> {
  _loadFile: () => Promise<T[]>;

  _saveJsonInFile: (data: T[]) => Promise<void>;

  _fileInfo: () => Promise<Stats>;

  _fileExist: () => boolean;
}
