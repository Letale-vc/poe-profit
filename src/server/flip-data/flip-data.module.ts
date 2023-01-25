import { Module } from '@nestjs/common';
import { FlipData } from '../meApp/flipData/flipData';
import { FlipDataController } from './flip-data.controller';

@Module({
  imports: [],
  controllers: [FlipDataController],
  providers: [{ provide: 'FlipData', useValue: new FlipData() }],
})
export class FlipDataModule {}
