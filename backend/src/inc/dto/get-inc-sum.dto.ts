import { IsDate, IsNumber, IsOptional } from 'class-validator';

export class GetIncSumDTO {
  @IsNumber()
  @IsOptional()
  readonly catalogID?: string;

  @IsDate()
  @IsOptional()
  readonly dateStart: Date;

  @IsDate()
  @IsOptional()
  readonly dateEnd: Date;
}
