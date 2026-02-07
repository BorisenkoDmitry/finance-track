import { IsDate, IsNumber, IsOptional } from 'class-validator';

export class GetBudgetsSumDTO {
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
