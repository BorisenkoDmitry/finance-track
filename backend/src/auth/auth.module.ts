import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtModuleAsyncOptions } from 'src/config/jwt.module.config';
import { Role } from 'src/roles/roles.entity';
import { AuthController } from './auth.controller';
import { User } from './auth.entity';
import { AuthService } from './auth.service';
import { JwtStrategy } from './authentication/jwt.strategy';
import { Token } from './token/token.entity';
import { JwtAuthGuard } from './authentication/jwt.guard';
import { APP_GUARD } from '@nestjs/core';
import { CatalogsService } from 'src/catalogs/catalogs.service';
import { CatalogEntity } from 'src/catalogs/catalogs.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Token, CatalogEntity]),
    JwtModule.registerAsync(jwtModuleAsyncOptions()),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [
    CatalogsService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    JwtStrategy,
    AuthService,
  ],
})
export class AuthModule {}
