import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthJoinDTO {
  @IsString()
  @IsEmail()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
