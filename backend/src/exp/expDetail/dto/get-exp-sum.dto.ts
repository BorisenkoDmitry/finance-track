import { IsDate, IsNumber, IsOptional } from 'class-validator';

export class GetExpSumDTO {
  @IsNumber()
  @IsOptional()
  readonly catalogId: string;

  @IsDate()
  @IsOptional()
  readonly dateStart: Date;

  @IsDate()
  @IsOptional()
  readonly dateEnd: Date;
}
