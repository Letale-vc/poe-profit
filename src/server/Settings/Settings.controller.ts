import { Controller, Inject, Get, Put, HttpException } from '@nestjs/common';
import { Body, Req } from '@nestjs/common/decorators';
import { SettingsFileManager } from '../../MyApp/FileManagers';
import { apiRouts, checkIpAddress, NODE_ENV } from '../../shared';
import { UpdateSettingsDto } from './dto/UpdateSettingsDto';
import type { Request } from 'express';
import { HttpStatus } from '@nestjs/common/enums';

@Controller(`api/${apiRouts.settings}`)
export class SettingsController {
  constructor(
    @Inject('SettingsManagerProvider')
    private readonly _settingsManagerProvider: SettingsFileManager,
  ) {}

  @Get()
  async getSettings(@Req() req: Request) {
    const ipv6Address = req.headers['X-Real-IP'] || req.socket.remoteAddress;
    const adminAddress = checkIpAddress(ipv6Address);
    if (NODE_ENV === 'development' || adminAddress) {
      return this._settingsManagerProvider.settingsCash;
    }
    throw new HttpException('Bed request', HttpStatus.BAD_REQUEST);
  }

  @Put()
  async update(@Req() req: Request, @Body() settings: UpdateSettingsDto) {
    const ipv6Address = req.headers['X-Real-IP'] || req.socket.remoteAddress;
    const adminAddress = checkIpAddress(ipv6Address);
    if (NODE_ENV === 'development' || adminAddress) {
      return this._settingsManagerProvider.update(settings);
    }
    throw new HttpException('Bed request', HttpStatus.BAD_REQUEST);
  }
}
