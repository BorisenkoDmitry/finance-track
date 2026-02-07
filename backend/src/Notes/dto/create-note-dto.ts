import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateNoteDTO {
  @IsString()
  @IsNotEmpty({
    message: 'заполние заголовок',
  })
  @IsOptional()
  readonly title?: string;

  @IsString()
  @IsNotEmpty({
    message: 'заполните контент',
  })
  @IsOptional()
  readonly content?: string;
}
