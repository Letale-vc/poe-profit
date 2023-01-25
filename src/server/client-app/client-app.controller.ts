import { Controller, Get, Inject, Render } from '@nestjs/common';
import { FlipData } from '../meApp/flipData/flipData';
import { FlipQueries } from '../meApp/flipQueries/FlipQueries';

@Controller()
export class ClientAppController {
  constructor(
    @Inject('FlipData')
    private readonly flipData: FlipData,
    @Inject('FlipQueries')
    private readonly flipQueries: FlipQueries,
  ) {}

  @Get('/')
  @Render('index')
  home() {
    // return this.flipData.getFlipDataInfo();
    return {};
  }

  @Get('/change-queries')
  @Render('change-queries')
  queriesChange() {
    // return this.flipQueries.getAllToClient();
    return {};
  }
}
