import { IsDate, IsOptional, IsString } from 'class-validator';

export class GetExpDTO {
  @IsString()
  @IsOptional()
  readonly price?: string;

  @IsString()
  @IsOptional()
  readonly descr?: string;

  @IsString()
  @IsOptional()
  readonly catalogId?: string;

  @IsDate()
  @IsOptional()
  readonly date?: Date;
}
