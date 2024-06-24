export interface IFileManager<T>{
    init:  (_baseValue:T) => Promise<boolean>,
    loadFile:  () => Promise<T | undefined>,
    saveFile:  (_data:T) => Promise<void>,
}
