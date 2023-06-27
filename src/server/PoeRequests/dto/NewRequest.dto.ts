import { IsString } from '@nestjs/class-validator';

export class NewRequestDto {
  @IsString()
  itemBuying: string;
  @IsString()
  itemSelling: string;
}
