import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Role } from 'src/roles/roles.entity';

export class GetUserDTO {
  id: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  surname: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  roles: Role[];
}
