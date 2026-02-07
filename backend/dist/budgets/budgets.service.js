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
exports.BudgetService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_docorator_1 = require("../auth/user.docorator");
const catalogs_entity_1 = require("../catalogs/catalogs.entity");
const typeorm_2 = require("typeorm");
const budgets_entity_1 = require("./budgets.entity");
const create_budgets_dto_1 = require("./dto/create-budgets.dto");
const get_budgets_dto_1 = require("./dto/get-budgets.dto");
const get_budget_sum_dto_1 = require("./dto/get-budget-sum.dto");
const getDaysInMonth = (date) => {
    const d = new Date(date);
    return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
};
let BudgetService = class BudgetService {
    budgetsRep;
    catalogRep;
    constructor(budgetsRep, catalogRep) {
        this.budgetsRep = budgetsRep;
        this.catalogRep = catalogRep;
    }
    async getAllBudgets(GetBudgetsDTO, userId) {
        const { type } = GetBudgetsDTO;
        let arr = [];
        if (type) {
            arr = await this.budgetsRep.find({
                order: {
                    createdAt: 'ASC',
                },
                where: {
                    type: type,
                    dateCreated: (0, typeorm_2.Between)(GetBudgetsDTO.dateStart, GetBudgetsDTO.dateEnd),
                    userId,
                },
                relations: ['catalogItem'],
            });
        }
        else {
            arr = await this.budgetsRep.find({
                order: {
                    createdAt: 'ASC',
                },
                where: {
                    dateCreated: (0, typeorm_2.Between)(GetBudgetsDTO.dateStart, GetBudgetsDTO.dateEnd),
                    userId,
                },
                relations: ['catalogItem'],
            });
        }
        const newBudgets = arr.flatMap((x) => {
            const { catalogItem, ...other } = x;
            return { ...other, categoryName: catalogItem?.catalogName };
        });
        return newBudgets;
    }
    async getBudgetId(id, userId) {
        const budget = await this.budgetsRep.findBy({ id, userId });
        if (!budget || budget.length === 0) {
            throw new common_1.NotFoundException('Budget not found');
        }
        return budget[0];
    }
    createBudget(budget, userId) {
        const newPost = this.budgetsRep.create({ ...budget, userId });
        return this.budgetsRep.save(newPost);
    }
    async updateBudget(id, budget, userId) {
        const oldBudget = await this.getBudgetId(id, userId);
        if (!oldBudget) {
            throw new common_1.NotFoundException('Budget not found');
        }
        const { categoryName, catalogId, ...other } = oldBudget;
        const editedPost = { ...other, ...budget };
        return await this.budgetsRep.save(editedPost);
    }
    async deleteBudget(id, userId) {
        const result = await this.budgetsRep.delete({ id, userId });
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Budget ${id} not exists`);
        }
    }
    async getBudgetsSumRange(userId, GetBudgetSumDto) {
        const days = await this.budgetsRep
            .createQueryBuilder('budgets')
            .select('DATE(budgets.dateCreated)', 'day')
            .addSelect('SUM(budgets.planned_amount)', 'total')
            .where('budgets.userId = :userId', { userId })
            .andWhere('budgets.catalogId = :catalogId', {
            catalogId: GetBudgetSumDto.catalogId,
        })
            .andWhere('budgets.dateCreated BETWEEN :start AND :end', {
            start: GetBudgetSumDto.dateStart,
            end: GetBudgetSumDto.dateEnd,
        })
            .groupBy('DATE(budgets.dateCreated)')
            .orderBy('DATE(budgets.dateCreated)', 'ASC')
            .getRawMany();
        const totalAcrossPeriod = await this.budgetsRep
            .createQueryBuilder('budgets')
            .select('SUM(budgets.planned_amount)', 'total')
            .where('budgets.userId = :userId', { userId })
            .andWhere('budgets.catalogId = :catalogId', {
            catalogId: GetBudgetSumDto.catalogId,
        })
            .andWhere('budgets.dateCreated BETWEEN :start AND :end', {
            start: GetBudgetSumDto.dateStart,
            end: GetBudgetSumDto.dateEnd,
        })
            .getRawOne();
        const totalForPeriod = totalAcrossPeriod?.total ?? 0;
        return {
            financeAnalitic: days.map((x) => {
                return {
                    total: String((Math.floor(Number(totalForPeriod)) / getDaysInMonth(x.day)).toFixed(2)),
                    day: x.day,
                };
            }),
            totalPeriodBudgets: totalForPeriod,
        };
    }
};
exports.BudgetService = BudgetService;
__decorate([
    __param(0, (0, common_1.Query)()),
    __param(1, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_budgets_dto_1.GetBudgetsDTO, String]),
    __metadata("design:returntype", Promise)
], BudgetService.prototype, "getAllBudgets", null);
__decorate([
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BudgetService.prototype, "getBudgetId", null);
__decorate([
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_budgets_dto_1.CreatedBudgetsDTO, String]),
    __metadata("design:returntype", void 0)
], BudgetService.prototype, "createBudget", null);
__decorate([
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_budgets_dto_1.CreatedBudgetsDTO, String]),
    __metadata("design:returntype", Promise)
], BudgetService.prototype, "updateBudget", null);
__decorate([
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BudgetService.prototype, "deleteBudget", null);
__decorate([
    __param(0, (0, user_docorator_1.CurrentUserID)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, get_budget_sum_dto_1.GetBudgetsSumDTO]),
    __metadata("design:returntype", Promise)
], BudgetService.prototype, "getBudgetsSumRange", null);
exports.BudgetService = BudgetService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(budgets_entity_1.Budgets)),
    __param(1, (0, typeorm_1.InjectRepository)(catalogs_entity_1.CatalogEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], BudgetService);
//# sourceMappingURL=budgets.service.js.map