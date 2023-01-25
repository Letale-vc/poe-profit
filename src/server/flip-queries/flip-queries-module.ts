import { Module } from '@nestjs/common';
import { FlipQueries } from '../meApp/flipQueries/FlipQueries';
import { FlipQueriesController } from './flip-queries-controller';

@Module({
  imports: [],
  controllers: [FlipQueriesController],
  providers: [{ provide: 'FlipQueries', useValue: new FlipQueries() }],
})
export class FlipQueriesModule {}
