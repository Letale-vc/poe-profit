import { Module } from '@nestjs/common';
import { FlipData } from '../meApp/flipData/flipData';
import { FlipQueries } from '../meApp/flipQueries/FlipQueries';
import { WorkingWithFile } from '../meApp/helpers/workingWithFile/WorkingWithFile';
import { fileNames } from '../meApp/helpers/workingWithFile/FileNames';

@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: 'FlipData',
      useValue: new FlipData(new WorkingWithFile(fileNames.POE_DATA)),
    },
    {
      provide: 'FlipQueries',
      useValue: new FlipQueries(
        new WorkingWithFile(fileNames.POE_QUERIES_SEARCH),
      ),
    },
  ],
})
export class ClientAppModule {}
