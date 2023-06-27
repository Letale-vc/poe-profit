import { fileNames, WorkingWithFile } from '../../Helpers';
import { UpdateSettingsType } from './Types/UpdateSettingsType';
import { SettingsType } from './Types/SettingsType';

export class SettingsFileManager extends WorkingWithFile<SettingsType> {
  private static instance: SettingsFileManager;
  settingsCash: SettingsType;
  constructor() {
    super(fileNames.SETTINGS);
  }

  static async getInstance() {
    if (!SettingsFileManager.instance) {
      SettingsFileManager.instance = new SettingsFileManager();
      await SettingsFileManager.instance._initFile();
    }
    return SettingsFileManager.instance;
  }

  async getSettings() {
    return this.settingsCash;
  }

  async _initFile(): Promise<void> {
    const initSettings: SettingsType = {
      expGemUpdate: true,
      flipUpdate: true,
      poesessid: '',
    };
    this.settingsCash = initSettings;
    super._initFile(initSettings);
  }

  async update(newSettings: UpdateSettingsType) {
    this.settingsCash = { ...this.settingsCash, ...newSettings };

    await this._saveJsonInFile(this.settingsCash);
  }
}
