import { IsDate, IsOptional, IsString } from 'class-validator';

export class GetFinanceDTO {
  @IsString()
  @IsOptional()
  readonly catalogId: string;

  @IsDate()
  @IsOptional()
  readonly dateStart: Date;

  @IsDate()
  @IsOptional()
  readonly dateEnd: Date;
}
