import { IsOptional, IsString } from 'class-validator';

export class GetExpDetailDTO {
  @IsString()
  @IsOptional()
  readonly price?: string;

  @IsString()
  @IsOptional()
  readonly name?: string;

  @IsString()
  @IsOptional()
  readonly count?: string;
}
