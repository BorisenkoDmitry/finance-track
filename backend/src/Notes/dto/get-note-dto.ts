import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';

export enum isDeletedEnum {
  no,
  yes,
  all,
}

export class GetNoteDTO {
  @IsString()
  @IsOptional()
  readonly title?: string;

  @IsDate()
  readonly dateStart: Date;

  @IsDate()
  readonly dateEnd: Date;

  @IsEnum(isDeletedEnum)
  @IsOptional()
  readonly isDeleted?: isDeletedEnum;
}
