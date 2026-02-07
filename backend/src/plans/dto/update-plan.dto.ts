import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePlanDto {
  @IsString()
  @IsNotEmpty()
  planID: string;

  @IsString()
  @IsNotEmpty()
  planDetailID: string;

  @IsString()
  @IsNotEmpty()
  planDetailPrice: string;
}
