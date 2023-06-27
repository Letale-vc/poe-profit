import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ExpGemsRequestManager,
  FlipRequestManager,
} from '../../MyApp/FileManagers';
import { apiRouts } from '../../shared/constants/ApiRouts';
import { RequestAndDataTypeNames } from '../../shared/constants/RequestAndDataType';

import { NewRequestDto } from './dto/NewRequest.dto';
import { UpdateRequestDto } from './dto/UpdateRequest.dto';

@Controller(`api/${apiRouts.PoeRequests}`)
export class PoeRequestsController {
  constructor(
    @Inject('ExpGemsRequestManagerProvider')
    private readonly expGemsRequestManager: ExpGemsRequestManager,
    @Inject('FlipRequestsManagerProvider')
    private readonly flipRequestManager: FlipRequestManager,
  ) {}

  @Get()
  async getAll(@Query('type') type: string) {
    if (type === RequestAndDataTypeNames.expGems) {
      return this.expGemsRequestManager.getAll();
    }
    if (type === RequestAndDataTypeNames.flip) {
      return this.flipRequestManager.getAll();
    }
    throw new HttpException('Bade Request', HttpStatus.BAD_REQUEST);
  }

  @Put()
  async update(
    @Query('type') type: string,
    @Body() RequestObject: UpdateRequestDto,
  ) {
    if (type === RequestAndDataTypeNames.expGems) {
      return await this.expGemsRequestManager.update(RequestObject);
    }
    if (type === RequestAndDataTypeNames.flip) {
      return await this.flipRequestManager.update(RequestObject);
    }
    throw new HttpException('Bed request', HttpStatus.BAD_REQUEST);
  }

  @Post()
  async add(@Query('type') type: string, @Body() newRequest: NewRequestDto) {
    if (type === RequestAndDataTypeNames.expGems) {
      return await this.expGemsRequestManager.add(newRequest);
    }
    if (type === RequestAndDataTypeNames.flip) {
      return await this.flipRequestManager.add(newRequest);
    }
    throw new HttpException('Bed request', HttpStatus.BAD_REQUEST);
  }

  @Delete()
  async delete(
    @Query('type') type: string,
    @Body() requestObject: UpdateRequestDto,
  ) {
    if (type === RequestAndDataTypeNames.expGems) {
      return await this.expGemsRequestManager.remove(requestObject);
    }
    if (type === RequestAndDataTypeNames.flip) {
      return await this.flipRequestManager.remove(requestObject);
    }
    throw new HttpException('Bed request', HttpStatus.BAD_REQUEST);
  }
}
