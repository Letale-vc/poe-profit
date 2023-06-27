import {
  IsNotEmpty,
  IsObject,
  IsString,
  IsUUID,
  ValidateNested,
} from '@nestjs/class-validator';
import type { TradeRequestType } from '../../../MyApp/API';

class ItemRequest {
  @IsNotEmpty()
  queryId: string;
  @IsString()
  url: string;
  @IsObject()
  tradeRequest: TradeRequestType;

  @IsString()
  name: string;
}

export class UpdateRequestDto {
  @ValidateNested()
  itemBuying: ItemRequest;

  @ValidateNested()
  itemSelling: ItemRequest;

  @IsUUID()
  @IsNotEmpty()
  uuid: string;
}
