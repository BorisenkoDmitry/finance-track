"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_module_config_1 = require("../config/jwt.module.config");
const roles_entity_1 = require("../roles/roles.entity");
const auth_controller_1 = require("./auth.controller");
const auth_entity_1 = require("./auth.entity");
const auth_service_1 = require("./auth.service");
const jwt_strategy_1 = require("./authentication/jwt.strategy");
const token_entity_1 = require("./token/token.entity");
const jwt_guard_1 = require("./authentication/jwt.guard");
const core_1 = require("@nestjs/core");
const catalogs_service_1 = require("../catalogs/catalogs.service");
const catalogs_entity_1 = require("../catalogs/catalogs.entity");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([auth_entity_1.User, roles_entity_1.Role, token_entity_1.Token, catalogs_entity_1.CatalogEntity]),
            jwt_1.JwtModule.registerAsync((0, jwt_module_config_1.jwtModuleAsyncOptions)()),
            passport_1.PassportModule,
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [
            catalogs_service_1.CatalogsService,
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_guard_1.JwtAuthGuard,
            },
            jwt_strategy_1.JwtStrategy,
            auth_service_1.AuthService,
        ],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map