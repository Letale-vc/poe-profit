import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Query,
} from '@nestjs/common';
import { ExpGemsDataManager, FlipDataManager } from '../../MyApp/FileManagers';
import { apiRouts } from '../../shared/constants/ApiRouts';
import { RequestAndDataTypeNames } from '../../shared/constants/RequestAndDataType';

@Controller(`api/${apiRouts.Data}`)
export class ProfitDataController {
  constructor(
    @Inject('FlipDataManagerProvider')
    private readonly flipDataManager: FlipDataManager,
    @Inject('ExpGemsDataManagerProvider')
    private readonly expGemsDataManager: ExpGemsDataManager,
  ) {}

  @Get()
  async getFlipData(@Query('type') type: string) {
    if (type === RequestAndDataTypeNames.flip) {
      return this.flipDataManager.getDataAndTimeInfo();
    }
    if (type === RequestAndDataTypeNames.expGems) {
      return this.expGemsDataManager.getDataAndTimeInfo();
    }
    throw new HttpException('Bade Request', HttpStatus.BAD_REQUEST);
  }
}
