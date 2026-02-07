import {
  BadRequestException,
  Body,
  ConflictException,
  NotFoundException,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import dayjs from 'dayjs';
import { Role } from 'src/roles/roles.entity';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import { User } from './auth.entity';
import { AuthCreateDTO } from './dto/auth-create.dto';
import { AuthJoinDTO } from './dto/auth-join.dto';
import { Token } from './token/token.entity';
import { CurrentUser, CurrentUserID } from './user.docorator';
import { CatalogsService } from 'src/catalogs/catalogs.service';
import { CatalogStatic } from 'src/catalogs/catalogs.static';
import { AuthChangePasswordDTO } from './dto/auth-change-pass.dto';

export class AuthService {
  constructor(
    @InjectRepository(User) private userRep: Repository<User>,
    @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
    @InjectRepository(Token) private readonly tokenRepo: Repository<Token>,
    private readonly jwtService: JwtService,
    private CatalogService: CatalogsService,
  ) {}

  findAll() {
    return this.userRep.find({
      relations: ['roles'],
    });
  }

  private hashPassword(password: string) {
    return hashSync(password, genSaltSync(10));
  }

  async findByEmail(
    @Param('email') email: string,
    isCreated?: boolean,
  ): Promise<User | null> {
    const user = await this.userRep.findOne({
      where: {
        email,
      },
      relations: ['roles'],
    });
    if (!isCreated) {
      if (!user || user === null) {
        throw new ConflictException(`User not found with this email: ${email}`);
      }
    }
    return user;
  }

  async findById(
    @Param('id') id: string,
    isCreated?: boolean,
  ): Promise<User | null> {
    const user = await this.userRep.findOne({
      where: {
        id,
      },
      relations: ['roles'],
    });
    if (!isCreated) {
      if (!user || user === null) {
        throw new ConflictException(`User not found with this id: ${id}`);
      }
    }
    return user;
  }

  async findByPhone(
    @Param('phone') phone: string,
    isCreated?: boolean,
  ): Promise<User | null> {
    const user = await this.userRep.findOne({
      where: {
        phone,
      },
      relations: ['roles'],
    });
    if (!isCreated) {
      if (!user || user === null) {
        throw new ConflictException(`User not found with this phone: ${phone}`);
      }
    }
    return user;
  }

  async createUser(@Body() userCreate: AuthCreateDTO) {
    const { password, ...user } = userCreate;
    const hashPassword = this.hashPassword(password);
    let role: Role | null = null;

    role = await this.roleRepo.findOne({
      where: {
        name: 'BetaUser',
      },
    });

    const conflictingPhone = await this.findByPhone(user.phone, true);
    if (conflictingPhone) {
      throw new ConflictException(`Phone ${user.phone} уже занят`);
    }

    const conflictingEmail = await this.findByEmail(user.email, true);

    if (conflictingEmail) {
      throw new ConflictException(`Email ${user.email} уже занят`);
    }

    if (!role) {
      throw new NotFoundException('Role not found');
    }
    user.roles = [...(user.roles ?? []), role];
    const userNew = this.userRep.create({
      ...user,
      password: hashPassword,
    });
    await this.userRep.save(userNew).catch(() => {
      throw new BadRequestException('Ошибка при создании пользователя');
    });

    await Promise.all(
      CatalogStatic.map((x) =>
        this.CatalogService.createCatalog(x, userNew.id),
      ),
    );
    return userNew;
  }

  async changePassword(
    @Body() params: AuthChangePasswordDTO,
    @CurrentUserID() userId: string,
  ) {
    const user = await this.findById(userId, false);
    if (!user) {
      throw new BadRequestException(`Такого пользователя не существует`);
    }
    const isPassSuccess = compareSync(params.oldPassword, user.password);
    if (!isPassSuccess) {
      throw new BadRequestException(`Неверный текущий пароль`);
    }

    if (params.newPassword != params.newPasswordRepeat) {
      throw new BadRequestException(`Новый и повторный пароли не совпадают`);
    }

    const hashPassword = this.hashPassword(params.newPassword);

    await this.userRep.save({ ...user, password: hashPassword });
    const { email, id, name, surname, roles, avatarPath } = user;
    return {
      result: true,
      user: { email, id, name, surname, roles, imageUrl: avatarPath },
    };
  }

  async authJoin(@Body() params: AuthJoinDTO) {
    const { email, password } = params;
    const user = await this.findByEmail(email, true);
    if (!user) {
      throw new UnauthorizedException(`Неверная почта`);
    }
    const isPassSuccess = compareSync(password, user.password);
    if (!isPassSuccess) {
      throw new UnauthorizedException(`Неверная пароль`);
    }

    const accessToken = this.jwtService.sign(
      {
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        roles: user.roles,
      },
      { expiresIn: '1h' },
    );

    const refreshToken = await this.GetRefreshToken(user.id);
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      user,
    };
  }

  async getMe(@CurrentUserID() userId: string) {
    const user = await this.userRep.findOne({
      where: { id: userId },
      relations: ['roles'],
    });
    if (!user) {
      return;
    }
    const { email, id, name, surname, roles, avatarPath } = user;
    return {
      result: true,
      user: { email, id, name, surname, roles, imageUrl: avatarPath },
    };
  }

  private GetRefreshToken(userID: string) {
    const currentDate = dayjs();
    const expireDate = currentDate.add(1, 'month').toDate();
    const tokenData = this.tokenRepo.create({
      token: v4(),
      exp: expireDate,
      userId: userID,
    });
    return this.tokenRepo.save(tokenData);
  }

  logout(@CurrentUser() user: User) {
    this.jwtService.sign(user, { expiresIn: '0.5s' });
  }

  async changeUserRole(
    @Body() { roleID, userID }: { roleID: string; userID: string },
  ) {
    const user = await this.findById(userID, false);
    if (!user) {
      throw new BadRequestException(`Такого пользователя не существует`);
    }
    const role = await this.roleRepo.findOne({
      where: {
        id: roleID,
      },
    });
    if (!role) {
      throw new BadRequestException(`Такой роли не существует`);
    }
    await this.userRep.save({ ...user, roles: [role] }).catch((err) => {
      throw new BadRequestException(`Не удалось изменить роль ${err}`);
    });

    return { result: true };
  }

  async deleteUserWithRelations(@Param('id') id: string): Promise<void> {
    const user = await this.userRep.findOne({
      where: { id },
      relations: [
        'roles',
        'tokens',
        'catalogs',
        'budgets',
        'incs',
        'exps',
        'expDetails',
      ], // подгружаем, чтобы remove удалил их
    });

    if (!user) throw new NotFoundException('User not found');

    await this.userRep.remove(user); // удалит user и связанные records, если каскад настроен
  }
}
