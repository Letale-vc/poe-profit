import { Module } from '@nestjs/common';
import { FlipData } from '../meApp/flipData/flipData';
import { FlipDataController } from './flip-data.controller';
import { WorkingWithFile } from '../meApp/helpers/workingWithFile/WorkingWithFile';
import { fileNames } from '../meApp/helpers/workingWithFile/FileNames';

@Module({
  imports: [],
  controllers: [FlipDataController],
  providers: [
    {
      provide: 'FlipData',
      useValue: new FlipData(new WorkingWithFile(fileNames.POE_DATA)),
    },
  ],
})
export class FlipDataModule {}
