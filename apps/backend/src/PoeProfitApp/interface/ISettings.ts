export interface ISettings {
    enable: boolean;
    subscribe(observer: (value: boolean) => void): void;
}
