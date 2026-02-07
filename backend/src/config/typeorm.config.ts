import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

export const typeOrmSyncConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: (ConfigService: ConfigService) => ({
    type: 'postgres',
    host: ConfigService.get('HOST'),
    port: Number(ConfigService.get('PORT')),
    username: ConfigService.get('NAMEUSER'),
    password: ConfigService.get('PASSWORD'),
    database: ConfigService.get('DATABASE'),
    autoLoadEntities: true,
    synchronize: String(ConfigService.get('TYPEORM_SYNC') ?? 'true') === 'true',
    logging: String(ConfigService.get('TYPEORM_LOGGING') ?? 'false') === 'true',
  }),
  inject: [ConfigService],
};
