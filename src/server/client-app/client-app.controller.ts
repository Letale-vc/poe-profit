import { Controller, Get, Render } from '@nestjs/common';
import { Req, Res } from '@nestjs/common/decorators';
import type { Request, Response } from 'express';
import { checkIpAddress } from '../../shared/utils/checkIpAddress';
import { logger } from '../../MyApp/Logger/LoggerPino';

@Controller()
export class ClientAppController {
  @Get('/')
  @Render('index')
  home() {
    return;
  }

  @Get('/changeRequest')
  @Render('changeRequest')
  queriesChange(@Req() req: Request, @Res() res: Response) {
    const ipv6Address =
      req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    const adminAddress = checkIpAddress(ipv6Address);
    if (!adminAddress) {
      res.redirect(301, '/');
    }
    return {};
  }

  @Get('/settings')
  @Render('settings')
  settings(@Req() req: Request, @Res() res: Response) {
    const ipv6Address =
      req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    logger.info(`IP Address: ${ipv6Address} trying to get settings`)
    const adminAddress = checkIpAddress(ipv6Address);
    if (!adminAddress) {
      res.redirect(301, '/');
      return
    }
    return {};
  }
}
