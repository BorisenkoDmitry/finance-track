"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_docorator_1 = require("../auth/user.docorator");
const budgets_entity_1 = require("../budgets/budgets.entity");
const budgets_service_1 = require("../budgets/budgets.service");
const catalogs_entity_1 = require("../catalogs/catalogs.entity");
const exp_entity_1 = require("../exp/exp.entity");
const exp_service_1 = require("../exp/exp.service");
const inc_entity_1 = require("../inc/inc.entity");
const inc_service_1 = require("../inc/inc.service");
const financeMonths_1 = require("../utils/financeMonths");
const typeorm_2 = require("typeorm");
const get_finance_dto_1 = require("./dto/get-finance.dto");
let FinanceService = class FinanceService {
    ExpRep;
    IncRep;
    CatalogRep;
    BudgetsRep;
    ExpService;
    IncService;
    BudgetsService;
    constructor(ExpRep, IncRep, CatalogRep, BudgetsRep, ExpService, IncService, BudgetsService) {
        this.ExpRep = ExpRep;
        this.IncRep = IncRep;
        this.CatalogRep = CatalogRep;
        this.BudgetsRep = BudgetsRep;
        this.ExpService = ExpService;
        this.IncService = IncService;
        this.BudgetsService = BudgetsService;
    }
    async getExpInc(userId) {
        const exps = await this.ExpService.getExpSumUser(userId);
        const incs = await this.IncService.getIncSumUser(userId);
        return {
            total: incs - exps,
        };
    }
    async getFinanceExps(userId, getFinanceDto) {
        const exps = await this.ExpService.getExpSumRange(userId, getFinanceDto);
        const budgets = await this.BudgetsService.getBudgetsSumRange(userId, getFinanceDto);
        const catalogItem = await this.CatalogRep.findOne({
            where: {
                id: getFinanceDto.catalogId,
            },
        });
        if (!catalogItem) {
            throw new common_1.NotFoundException(`Catalog ${getFinanceDto.catalogId} not exists`);
        }
        return {
            exps,
            budgets,
            catalogName: catalogItem.catalogName,
            catalogType: catalogItem.catalogType,
            catalogColor: catalogItem.catalogColor,
        };
    }
    async getFinanceInc(userId, getFinanceDto) {
        const incs = await this.IncRep.find({
            where: {
                date: (0, typeorm_2.Between)(getFinanceDto.dateStart, getFinanceDto.dateEnd),
                userId,
            },
        });
        const exps = await this.ExpRep.find({
            where: {
                date: (0, typeorm_2.Between)(getFinanceDto.dateStart, getFinanceDto.dateEnd),
                userId,
            },
        });
        const budgets = await this.BudgetsRep.find({
            where: {
                createdAt: (0, typeorm_2.Between)(getFinanceDto.dateStart, getFinanceDto.dateEnd),
                type: 1,
                userId,
            },
            relations: ['catalogItem'],
        });
        return (0, financeMonths_1.getMonthlyResult)(exps, incs, budgets, getFinanceDto.dateStart, getFinanceDto.dateEnd);
    }
};
exports.FinanceService = FinanceService;
__decorate([
    __param(0, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FinanceService.prototype, "getExpInc", null);
__decorate([
    __param(0, (0, user_docorator_1.CurrentUserID)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, get_finance_dto_1.GetFinanceDTO]),
    __metadata("design:returntype", Promise)
], FinanceService.prototype, "getFinanceExps", null);
__decorate([
    __param(0, (0, user_docorator_1.CurrentUserID)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, get_finance_dto_1.GetFinanceDTO]),
    __metadata("design:returntype", Promise)
], FinanceService.prototype, "getFinanceInc", null);
exports.FinanceService = FinanceService = __decorate([
    __param(0, (0, typeorm_1.InjectRepository)(exp_entity_1.Exp)),
    __param(1, (0, typeorm_1.InjectRepository)(inc_entity_1.IncEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(catalogs_entity_1.CatalogEntity)),
    __param(3, (0, typeorm_1.InjectRepository)(budgets_entity_1.Budgets)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        exp_service_1.ExpService,
        inc_service_1.IncService,
        budgets_service_1.BudgetService])
], FinanceService);
//# sourceMappingURL=finance.service.js.map