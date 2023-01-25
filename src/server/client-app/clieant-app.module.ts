import { Module } from '@nestjs/common';
import { FlipData } from '../meApp/flipData/flipData';
import { FlipQueries } from '../meApp/flipQueries/FlipQueries';

@Module({
  imports: [],
  controllers: [],
  providers: [
    { provide: 'FlipData', useValue: new FlipData() },
    { provide: 'FlipQueries', useValue: new FlipQueries() },
  ],
})
export class ClientAppModule {}
