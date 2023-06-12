import { Module } from '@nestjs/common';
import { FlipQueries } from '../meApp/flipQueries/FlipQueries';
import { FlipQueriesController } from './flip-queries-controller';
import { WorkingWithFile } from '../meApp/helpers/workingWithFile/WorkingWithFile';

@Module({
  imports: [],
  controllers: [FlipQueriesController],
  providers: [
    {
      provide: 'FlipQueries',
      useValue: new FlipQueries(new WorkingWithFile('poeSearchUrls.json')),
    },
  ],
})
export class FlipQueriesModule {}
