import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CategoryType } from './get-budgets.dto';

export class CreatedBudgetsDTO {
  @IsString()
  @IsOptional()
  readonly categoryName?: string;

  @IsString()
  @IsOptional()
  readonly color?: string;

  @IsString()
  @IsOptional()
  readonly comment?: string;

  @IsString()
  @IsOptional()
  readonly period?: 'month';

  @IsString()
  @IsOptional()
  readonly planned_amount?: string;

  @IsString()
  @IsOptional()
  readonly dateCreated?: string;

  @IsString()
  @IsOptional()
  readonly catalogId?: string;

  @IsEnum(CategoryType)
  @IsOptional()
  readonly type?: CategoryType;
}
