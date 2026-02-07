import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { User } from './auth.entity';
import { AuthService } from './auth.service';
import { Public } from './authentication/jwt.isPublic';
import { AuthCreateDTO } from './dto/auth-create.dto';
import { AuthJoinDTO } from './dto/auth-join.dto';
import { CurrentUser, CurrentUserID } from './user.docorator';
import { AuthChangePasswordDTO } from './dto/auth-change-pass.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get('find-by-email/:email')
  findByEmail(@Param('id') email: string) {
    return this.authService.findByEmail(email);
  }

  @Get('find-by-phone/:phone')
  findByPhone(@Param('phone') phone: string) {
    return this.authService.findByPhone(phone);
  }

  @Public()
  @Post('register')
  createUser(@Body() createUserDTO: AuthCreateDTO) {
    return this.authService.createUser(createUserDTO);
  }

  @Post('logout')
  logoutUser(@CurrentUser() user: User) {
    return this.authService.logout(user);
  }

  @Post('change-role')
  changeUserRole(
    @Body() { roleID, userID }: { roleID: string; userID: string },
  ) {
    return this.authService.changeUserRole({ roleID, userID });
  }

  @Post('change-password')
  async changePassword(
    @Body() params: AuthChangePasswordDTO,
    @CurrentUserID() userId: string,
  ) {
    return this.authService.changePassword(params, userId);
  }

  @Get('/me')
  getMe(@CurrentUserID() userId: string) {
    return this.authService.getMe(userId);
  }

  @Public()
  @Post('login')
  authJoin(@Body() params: AuthJoinDTO) {
    return this.authService.authJoin(params);
  }

  @Delete(':id')
  async deleteUserWithRelations(@Param('id') id: string): Promise<void> {
    return this.authService.deleteUserWithRelations(id);
  }
}
