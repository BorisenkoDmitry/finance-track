import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreatePlanDto {
  @IsDate()
  planDate: Date;

  @IsString()
  @IsNotEmpty()
  planName: string;

  @IsString()
  @IsNotEmpty()
  planPrice: string;

  @IsString()
  planColor?: string;
}
