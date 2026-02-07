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
exports.PlansService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_docorator_1 = require("../auth/user.docorator");
const plan_1 = require("../utils/plan");
const typeorm_2 = require("typeorm");
const create_plan_dto_1 = require("./dto/create-plan.dto");
const update_plan_checked_dto_1 = require("./dto/update-plan-checked.dto");
const update_plan_dto_1 = require("./dto/update-plan.dto");
const plan_entity_1 = require("./plan.entity");
const planDetail_entity_1 = require("./planDetail/planDetail.entity");
const planDetail_service_1 = require("./planDetail/planDetail.service");
let PlansService = class PlansService {
    planRep;
    planDetailRep;
    planDetailService;
    constructor(planRep, planDetailRep, planDetailService) {
        this.planRep = planRep;
        this.planDetailRep = planDetailRep;
        this.planDetailService = planDetailService;
    }
    async getAllPlans(userId) {
        const plans = await this.planRep.find({
            where: { userId },
            relations: ['detailPlans'],
            order: { planDate: 'ASC' },
        });
        plans.forEach((plan) => {
            plan.detailPlans.sort((a, b) => new Date(a.planDetailDatePay).getTime() -
                new Date(b.planDetailDatePay).getTime());
        });
        return plans.map((x) => {
            return {
                ...x,
                detailPlans: x.detailPlans.map((t) => {
                    return { ...t, planDetailPrice: Number(t.planDetailPrice) };
                }),
                planPrice: Number(x.planPrice),
            };
        });
    }
    async createPlan(params, userId) {
        const newPlan = this.planRep.create({ ...params, userId });
        const startDate = new Date();
        const endDate = new Date(newPlan.planDate);
        if (endDate.getTime() - startDate.getTime() < 0) {
            throw new common_1.BadRequestException(`Укажите дату не раньше сегодняшней`);
        }
        const createdPlan = await this.planRep.save(newPlan);
        if (endDate.getTime() - startDate.getTime() > 0) {
            const rangeMonth = (0, plan_1.getMonthsDifference)(startDate, endDate);
            const array = (0, plan_1.printMonthsRange)(startDate, endDate);
            for (let i = 0; i < array.length; i++) {
                const createdPlanDetail = this.planDetailRep.create({
                    planId: createdPlan.id,
                    planDetailDatePay: array[i],
                    planDetailDate: params.planDate,
                    planDetailPrice: String(Math.floor(Number(newPlan.planPrice) / rangeMonth)),
                });
                await this.planDetailRep.save(createdPlanDetail);
            }
        }
        return this.planRep.findOne({
            where: {
                userId,
                id: createdPlan.id,
            },
            relations: ['detailPlans'],
        });
    }
    async updatePlant(params, userId) {
        const foundedPlan = await this.planRep.findOne({
            where: {
                id: params.planID,
                userId,
            },
        });
        if (!foundedPlan) {
            throw new common_1.NotFoundException('Plan not found');
        }
        const price = Number(foundedPlan.planPrice) - Number(params.planDetailPrice);
        if (price >= 0) {
            foundedPlan.planPrice = String(price);
            await this.planDetailService.updatePlanDetail(params.planDetailID, {
                isComplete: true,
                planDetailPrice: params.planDetailPrice,
                planDetailDate: new Date(),
            });
            const otherPlanDetail = foundedPlan.detailPlans.filter((x) => x.id != params.planDetailID);
            await Promise.all(otherPlanDetail.map((pl) => {
                return this.planDetailService.updatePlanDetail(pl.id, {
                    isComplete: false,
                    planDetailDate: pl.planDetailDate,
                    planDetailPrice: String(Math.floor(price / otherPlanDetail.length)),
                });
            }));
        }
        else {
            foundedPlan.planPrice = '0';
        }
        return this.planRep.save(foundedPlan);
    }
    async updatePlanChecked(id, planCheckedDTO) {
        const a = await this.planDetailRep.findOne({
            where: {
                id,
            },
        });
        if (!a) {
            throw new common_1.NotFoundException('PlanDetail not found');
        }
        a.isComplete = true;
        a.planDetailPrice = planCheckedDTO.price;
        const n = await this.planDetailRep.save(a);
        const plan = await this.planRep.findOne({
            where: {
                id: n.planId,
            },
            relations: ['detailPlans'],
        });
        if (!plan) {
            throw new common_1.NotFoundException('Plan not found');
        }
        const s = plan.detailPlans
            .filter((x) => x.isComplete)
            .reduce((sum, next) => sum + (next.planDetailPrice ? parseFloat(next.planDetailPrice) : 0), 0);
        if (parseFloat(plan.planPrice) <= parseFloat(planCheckedDTO.price) ||
            parseFloat(plan.planPrice) <= s) {
            await Promise.all(plan.detailPlans.map((pl) => {
                return this.planDetailService.updatePlanDetail(pl.id, {
                    isComplete: true,
                    planDetailDate: pl.planDetailDate,
                    planDetailPrice: pl.planDetailPrice,
                });
            }));
            const pl = await this.planRep.save(plan);
            return pl;
        }
        else {
            const rangePrice = parseFloat(plan.planPrice) -
                plan.detailPlans
                    .filter((x) => x.isComplete)
                    .reduce((sum, next) => sum +
                    (next.planDetailPrice ? parseFloat(next.planDetailPrice) : 0), 0);
            await Promise.all(plan.detailPlans
                .filter((x) => !x.isComplete)
                .map((pl) => {
                return this.planDetailService.updatePlanDetail(pl.id, {
                    isComplete: false,
                    planDetailDate: pl.planDetailDate,
                    planDetailPrice: String((rangePrice /
                        plan.detailPlans.filter((x) => !x.isComplete).length).toFixed(2)),
                });
            }));
            const pl = await this.planRep.save(plan);
            return pl;
        }
    }
    async deletePlan(id, userId) {
        const result = await this.planRep.delete({ id, userId });
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Exp ${id} not exists`);
        }
        return {
            isDeleted: result.affected != 0,
        };
    }
};
exports.PlansService = PlansService;
__decorate([
    __param(0, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PlansService.prototype, "getAllPlans", null);
__decorate([
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_plan_dto_1.CreatePlanDto, String]),
    __metadata("design:returntype", Promise)
], PlansService.prototype, "createPlan", null);
__decorate([
    __param(0, (0, common_1.Param)()),
    __param(1, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_plan_dto_1.UpdatePlanDto, String]),
    __metadata("design:returntype", Promise)
], PlansService.prototype, "updatePlant", null);
__decorate([
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_plan_checked_dto_1.UpdatePlanCheckedDto]),
    __metadata("design:returntype", Promise)
], PlansService.prototype, "updatePlanChecked", null);
__decorate([
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PlansService.prototype, "deletePlan", null);
exports.PlansService = PlansService = __decorate([
    __param(0, (0, typeorm_1.InjectRepository)(plan_entity_1.PlanEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(planDetail_entity_1.PlanDetailEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        planDetail_service_1.DetailPlansService])
], PlansService);
//# sourceMappingURL=plan.service.js.map