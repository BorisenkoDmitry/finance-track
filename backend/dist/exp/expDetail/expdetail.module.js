"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpDetailModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const expdetail_controller_1 = require("./expdetail.controller");
const expdetail_entity_1 = require("./expdetail.entity");
const expodetail_service_1 = require("./expodetail.service");
const exp_entity_1 = require("../exp.entity");
let ExpDetailModule = class ExpDetailModule {
};
exports.ExpDetailModule = ExpDetailModule;
exports.ExpDetailModule = ExpDetailModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([expdetail_entity_1.ExpDetail, exp_entity_1.Exp])],
        controllers: [expdetail_controller_1.ExpDetailController],
        providers: [expodetail_service_1.ExpDetailService],
    })
], ExpDetailModule);
//# sourceMappingURL=expdetail.module.js.map