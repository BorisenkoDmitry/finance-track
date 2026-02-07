import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum CategoryType {
  inc = 1,
  exp,
  source,
  pay,
  all,
}

export class GetBudgetsDTO {
  @IsString()
  @IsOptional()
  readonly dateStart: string;

  @IsString()
  @IsOptional()
  readonly dateEnd: string;

  @IsEnum(CategoryType)
  @IsOptional()
  readonly type?: CategoryType;
}
