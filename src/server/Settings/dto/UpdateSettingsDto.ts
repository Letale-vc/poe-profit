import { IsBoolean, IsString } from '@nestjs/class-validator';
import { UpdateSettingsType } from '../../../MyApp/FileManagers';

export class UpdateSettingsDto implements UpdateSettingsType {
  @IsBoolean()
  expGemUpdate?: boolean;

  @IsBoolean()
  flipUpdate?: boolean;

  @IsString()
  poesessid?: string;
}
