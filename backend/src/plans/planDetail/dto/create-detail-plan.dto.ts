import { IsBoolean, IsDate, IsOptional, IsString } from 'class-validator';

export class CreatePlanDetailDto {
  @IsString()
  planDetailPrice: string;

  @IsDate()
  planDetailDate: Date;

  @IsBoolean()
  @IsOptional()
  isComplete?: boolean;
}
