import { Controller, Get, Render } from '@nestjs/common';
import { Req, Res } from '@nestjs/common/decorators';
import type { Request, Response } from 'express';
import { checkIpAddress } from '../../shared/utils/checkIpAddress';

@Controller()
export class ClientAppController {
  @Get('/')
  @Render('index')
  home() {
    return { someData: 'someData' };
  }

  @Get('/changeRequest')
  @Render('changeRequest')
  queriesChange(@Req() req: Request, @Res() res: Response) {
    const adminAddress = checkIpAddress(req);
    if (!adminAddress) {
      return res.redirect(301, '/');
    }
    return {};
  }

  @Get('/settings')
  @Render('settings')
  settings(@Req() req: Request, @Res() res: Response) {
    const adminAddress = checkIpAddress(req);
    if (!adminAddress) {
      return res.redirect(301, '/');
    }
    return {};
  }
}
