import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
} from '@nestjs/class-validator';

export class UpdateFlipQueriesDto {
  @IsString()
  itemBuying: string;

  @IsString()
  itemSelling: string;

  @IsNumber()
  itemSellingPriceMultiplier: number;

  @IsUUID()
  @IsNotEmpty()
  uuid: string;
}
