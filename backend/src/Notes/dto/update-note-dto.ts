import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateNoteDTO {
  @IsString()
  @IsOptional()
  readonly title?: string;

  @IsString()
  @IsOptional()
  readonly content?: string;

  @IsBoolean()
  @IsOptional()
  readonly completed?: boolean;

  @IsBoolean()
  @IsOptional()
  readonly isDeleted?: boolean;
}
