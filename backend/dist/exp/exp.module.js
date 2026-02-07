"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpModule = void 0;
const common_1 = require("@nestjs/common");
const exp_controller_1 = require("./exp.controller");
const exp_service_1 = require("./exp.service");
const typeorm_1 = require("@nestjs/typeorm");
const exp_entity_1 = require("./exp.entity");
const expdetail_module_1 = require("./expDetail/expdetail.module");
const expdetail_entity_1 = require("./expDetail/expdetail.entity");
const catalogs_entity_1 = require("../catalogs/catalogs.entity");
const catalogs_service_1 = require("../catalogs/catalogs.service");
let ExpModule = class ExpModule {
};
exports.ExpModule = ExpModule;
exports.ExpModule = ExpModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([exp_entity_1.Exp, expdetail_entity_1.ExpDetail, catalogs_entity_1.CatalogEntity]),
            expdetail_module_1.ExpDetailModule,
        ],
        controllers: [exp_controller_1.ExpController],
        providers: [exp_service_1.ExpService, catalogs_service_1.CatalogsService],
    })
], ExpModule);
//# sourceMappingURL=exp.module.js.map