"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const budgets_module_1 = require("./budgets/budgets.module");
const catalogs_module_1 = require("./catalogs/catalogs.module");
const typeorm_config_1 = require("./config/typeorm.config");
const exp_module_1 = require("./exp/exp.module");
const inc_module_1 = require("./inc/inc.module");
const roles_module_1 = require("./roles/roles.module");
const finance_module_1 = require("./finance/finance.module");
const notes_module_1 = require("./Notes/notes.module");
const plan_module_1 = require("./plans/plan.module");
const avatarUser_module_1 = require("./auth/avatarUser/avatarUser.module");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                envFilePath: '.env.development',
                isGlobal: true,
            }),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, '..', 'public'),
                serveRoot: '/static',
            }),
            typeorm_1.TypeOrmModule.forRootAsync(typeorm_config_1.typeOrmSyncConfig),
            budgets_module_1.BudgetsModule,
            exp_module_1.ExpModule,
            inc_module_1.IncModule,
            catalogs_module_1.CatalogModule,
            auth_module_1.AuthModule,
            roles_module_1.RoleModule,
            finance_module_1.FinanceModule,
            notes_module_1.NoteModule,
            plan_module_1.PlanModule,
            avatarUser_module_1.AvatarModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map