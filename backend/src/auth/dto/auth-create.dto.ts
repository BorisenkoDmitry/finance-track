import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { Role } from 'src/roles/roles.entity';

export class AuthCreateDTO {
  @IsString()
  @IsEmail()
  readonly email: string;

  @IsString()
  @IsPhoneNumber(undefined, { message: 'Номер телефона введён не корректно' })
  readonly phone: string;

  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly surname: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @IsOptional()
  readonly roles?: Role[];
}
