import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTagDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  color?: string;
}
