export * from './WorkingWithFile/WorkingWithFile';
export * from './WorkingWithFile/constants';
export * from './WorkingWithFile/Types/FilesType';
export * from './Utils';

export type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];
