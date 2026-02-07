import { IsDate, IsOptional, IsString } from 'class-validator';

export class GetIncFilterDTO {
  @IsDate()
  @IsOptional()
  readonly dateStart: Date;

  @IsDate()
  @IsOptional()
  readonly dateEnd: Date;

  @IsString()
  @IsOptional()
  readonly source?: string;

  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsString()
  @IsOptional()
  readonly sum?: string;
}
