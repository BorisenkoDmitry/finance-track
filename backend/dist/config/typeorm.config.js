"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOrmSyncConfig = void 0;
const config_1 = require("@nestjs/config");
exports.typeOrmSyncConfig = {
    imports: [config_1.ConfigModule],
    useFactory: (ConfigService) => ({
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
    inject: [config_1.ConfigService],
};
//# sourceMappingURL=typeorm.config.js.map