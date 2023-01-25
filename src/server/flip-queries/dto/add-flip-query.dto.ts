import { IsNumber, IsString } from '@nestjs/class-validator';

export class AddFlipQueryDto {
  @IsString()
  itemBuying: string;
  @IsString()
  itemSelling: string;
  @IsNumber()
  itemSellingPriceMultiplier: number;
}
