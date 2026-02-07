"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOrmSyncConfig = void 0;
const config_1 = require("@nestjs/config");
exports.typeOrmSyncConfig = {
    imports: [config_1.ConfigModule],
    useFactory: (ConfigService) => ({
        type: 'postgres',
        host: ConfigService.get('HOST'),
        port: ConfigService.get('PORT'),
        username: ConfigService.get('NAMEUSER'),
        password: ConfigService.get('PASSWORD'),
        database: ConfigService.get('DATABASE'),
        autoLoadEntities: true,
        synchronize: true,
        logging: true,
    }),
    inject: [config_1.ConfigService],
};
//# sourceMappingURL=typeorm.config.js.map