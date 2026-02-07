import { IsNotEmpty, IsString } from 'class-validator';

export class AuthChangePasswordDTO {
  @IsString()
  @IsNotEmpty()
  readonly oldPassword: string;
  @IsString()
  @IsNotEmpty()
  readonly newPassword: string;
  @IsString()
  @IsNotEmpty()
  readonly newPasswordRepeat: string;
}
