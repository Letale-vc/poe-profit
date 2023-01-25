import { Controller, Get, Inject } from '@nestjs/common';
import { PoeFlipDataType } from '../../shared/types/flipObjectTypes';
import { FlipData } from '../meApp/flipData/flipData';

@Controller('api/flipData')
export class FlipDataController {
  constructor(@Inject('FlipData') private readonly flipData: FlipData) {}

  @Get()
  async getFlipData(): Promise<PoeFlipDataType> {
    return this.flipData.getFlipDataInfo();
  }
}
