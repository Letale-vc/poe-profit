export interface CurrencyFileWorks<T> {
  loadFile: () => Promise<T[]>;
}
