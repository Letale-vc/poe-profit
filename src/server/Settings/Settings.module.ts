import { Module } from '@nestjs/common';
import { SettingsFileManager } from '../../MyApp/FileManagers';
import { SettingsController } from './Settings.controller';

export const SettingsManagerProvider = {
  provide: 'SettingsManagerProvider',
  useFactory: async () => {
    const manager = await SettingsFileManager.getInstance();
    return manager;
  },
};
@Module({
  imports: [],
  controllers: [SettingsController],
  providers: [SettingsManagerProvider],
})
export class SettingsModule {}
