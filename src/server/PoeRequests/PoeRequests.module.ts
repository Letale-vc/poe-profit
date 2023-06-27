import { Module } from '@nestjs/common';
import { PoeApi } from '../../MyApp/API/PoeApi';
import {
  ExpGemsRequestManager,
  FlipRequestManager,
  SettingsFileManager,
} from '../../MyApp/FileManagers';

import { PoeRequestsController } from './PoeRequests.controller';

export const ExpGemsRequestManagerProvider = {
  provide: 'ExpGemsRequestManagerProvider',
  useFactory: async () => {
    const poeApi = await PoeApi.getInstance();
    const settings = await SettingsFileManager.getInstance();
    const expGemsRequestManager = new ExpGemsRequestManager(poeApi, settings);
    await expGemsRequestManager._initFile();
    return expGemsRequestManager;
  },
};
export const FlipRequestsManagerProvider = {
  provide: 'FlipRequestsManagerProvider',
  useFactory: async () => {
    const poeApi = await PoeApi.getInstance();
    const settings = await SettingsFileManager.getInstance();
    const flipRequestManager = new FlipRequestManager(poeApi, settings);
    await flipRequestManager._initFile();
    return flipRequestManager;
  },
};

@Module({
  imports: [],
  controllers: [PoeRequestsController],
  providers: [ExpGemsRequestManagerProvider, FlipRequestsManagerProvider],
})
export class PoeRequestsModule {}
