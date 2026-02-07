"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanceModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const exp_entity_1 = require("../exp/exp.entity");
const inc_entity_1 = require("../inc/inc.entity");
const finance_controller_1 = require("./finance.controller");
const finance_service_1 = require("./finance.service");
const exp_service_1 = require("../exp/exp.service");
const inc_service_1 = require("../inc/inc.service");
const expdetail_entity_1 = require("../exp/expDetail/expdetail.entity");
const catalogs_entity_1 = require("../catalogs/catalogs.entity");
const budgets_service_1 = require("../budgets/budgets.service");
const budgets_entity_1 = require("../budgets/budgets.entity");
let FinanceModule = class FinanceModule {
};
exports.FinanceModule = FinanceModule;
exports.FinanceModule = FinanceModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                inc_entity_1.IncEntity,
                exp_entity_1.Exp,
                expdetail_entity_1.ExpDetail,
                catalogs_entity_1.CatalogEntity,
                budgets_entity_1.Budgets,
            ]),
        ],
        controllers: [finance_controller_1.FinanceController],
        providers: [finance_service_1.FinanceService, exp_service_1.ExpService, inc_service_1.IncService, budgets_service_1.BudgetService],
    })
], FinanceModule);
//# sourceMappingURL=finance.module.js.map