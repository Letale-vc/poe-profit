import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

export const FlipQueriesValidBody = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const { itemBuying, itemSelling } = request.body;

    try {
      if (
        typeof JSON.parse(itemBuying) === 'object' &&
        typeof JSON.parse(itemSelling) === 'object'
      )
        return request.body;
      throw new HttpException(
        { error: 'Bed request', status: HttpStatus.BAD_REQUEST },
        HttpStatus.BAD_REQUEST,
      );
    } catch (e) {
      throw new HttpException(
        { error: 'Bed request', status: HttpStatus.BAD_REQUEST },
        HttpStatus.BAD_REQUEST,
      );
    }
  },
);
