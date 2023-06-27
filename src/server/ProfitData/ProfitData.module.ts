import { Module } from '@nestjs/common';
import { ExpGemsDataManager, FlipDataManager } from '../../MyApp/FileManagers';
import { ProfitDataController } from './ProfitData.controller';

export const FlipDataManagerProvider = {
  provide: 'FlipDataManagerProvider',
  useFactory: async () => {
    const flipRequestManager = new FlipDataManager();
    await flipRequestManager._initFile();
    return flipRequestManager;
  },
};
export const ExpGemsDataManagerProvider = {
  provide: 'ExpGemsDataManagerProvider',
  useFactory: async () => {
    const expGemsRequestManager = new ExpGemsDataManager();
    await expGemsRequestManager._initFile();
    return expGemsRequestManager;
  },
};
@Module({
  imports: [],
  controllers: [ProfitDataController],
  providers: [FlipDataManagerProvider, ExpGemsDataManagerProvider],
})
export class ProfitDataModule {}
