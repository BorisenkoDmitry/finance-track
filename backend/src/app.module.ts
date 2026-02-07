import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BudgetsModule } from './budgets/budgets.module';
import { CatalogModule } from './catalogs/catalogs.module';
import { typeOrmSyncConfig } from './config/typeorm.config';
import { ExpModule } from './exp/exp.module';
import { IncModule } from './inc/inc.module';
import { RoleModule } from './roles/roles.module';
import { FinanceModule } from './finance/finance.module';
import { NoteModule } from './Notes/notes.module';
import { PlanModule } from './plans/plan.module';
import { AvatarModule } from './auth/avatarUser/avatarUser.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        `.env.${process.env.NODE_ENV ?? 'development'}`,
        '.env',
        '.env.development',
      ],
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // Путь к статике
      serveRoot: '/static', // Префикс URL (опционально)
    }),
    TypeOrmModule.forRootAsync(typeOrmSyncConfig),
    BudgetsModule,
    ExpModule,
    IncModule,
    CatalogModule,
    AuthModule,
    RoleModule,
    FinanceModule,
    NoteModule,
    PlanModule,
    AvatarModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
