import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePlanCheckedDto {
  @IsString()
  @IsNotEmpty()
  price: string;
}
