import { IsDate, IsOptional, IsString } from 'class-validator';

export class GetIncDTO {
  @IsDate()
  @IsOptional()
  readonly date?: Date;

  @IsString()
  @IsOptional()
  readonly source?: string;

  @IsString()
  @IsOptional()
  readonly sum?: string;

  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsString()
  @IsOptional()
  readonly typeInc?: string;

  @IsString()
  @IsOptional()
  readonly method?: string;

  @IsString()
  @IsOptional()
  readonly catalogId?: string;
}
