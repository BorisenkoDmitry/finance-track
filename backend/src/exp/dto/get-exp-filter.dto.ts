import { IsDate, IsOptional, IsString } from 'class-validator';

export class GetExpFilterDTO {
  @IsString()
  @IsOptional()
  readonly price?: string;

  @IsString()
  @IsOptional()
  readonly descr?: string;

  @IsOptional()
  readonly categoryId?: string;

  @IsDate()
  @IsOptional()
  readonly dateStart: Date;

  @IsDate()
  @IsOptional()
  readonly dateEnd: Date;
}
