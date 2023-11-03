import { FILE_NAMES, WorkingWithFile } from '../../Helpers';
import { type UpdateSettingsType } from './Types/UpdateSettingsType';
import {
  type SettingsReturnType,
  type SettingsType,
} from './Types/SettingsType';

export class SettingsFileManager extends WorkingWithFile<SettingsType> {
  private static instance: SettingsFileManager;

  settingsCash: SettingsType = {
    expGemUpdate: true,
    flipUpdate: true,
    poesessid: '',
  };
  constructor() {
    super(FILE_NAMES.SETTINGS);
  }

  static getInstance(): SettingsFileManager {
    if (!SettingsFileManager.instance) {
      SettingsFileManager.instance = new SettingsFileManager();
    }
    return SettingsFileManager.instance;
  }

  async init(): Promise<void> {
    await this.initFile(this.settingsCash);
  }
  async updateCash() {
    this.settingsCash = await this.loadFile();
  }
  async getPoesessid(): Promise<string> {
    return (await this.loadFile()).poesessid;
  }

  async getSettings(): Promise<SettingsReturnType> {
    return await this.loadFile();
  }

  async mutate(newSettings: UpdateSettingsType): Promise<void> {
    const currentSettings = await this.getSettings();
    const settings = {
      expGemUpdate: newSettings.expGemUpdate ?? currentSettings.expGemUpdate,
      flipUpdate: newSettings.flipUpdate ?? currentSettings.flipUpdate,
      poesessid: newSettings.poesessid ?? currentSettings.poesessid,
    };
    await this.saveJsonInFile(settings);
  }
}
