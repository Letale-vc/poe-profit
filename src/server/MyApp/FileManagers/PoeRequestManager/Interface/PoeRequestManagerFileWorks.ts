import { type Stats } from "fs";

export interface PoeRequestManagerFileWorks<T> {
  loadFile: () => Promise<T[]>;

  saveJsonInFile: (data: T[]) => Promise<void>;

  fileInfo: () => Promise<Stats>;

  fileExist: () => boolean;
}
