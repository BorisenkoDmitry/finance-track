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
exports.DetailPlansService = void 0;
const typeorm_1 = require("@nestjs/typeorm");
const planDetail_entity_1 = require("./planDetail.entity");
const typeorm_2 = require("typeorm");
const common_1 = require("@nestjs/common");
const create_detail_plan_dto_1 = require("./dto/create-detail-plan.dto");
let DetailPlansService = class DetailPlansService {
    planDetailRep;
    constructor(planDetailRep) {
        this.planDetailRep = planDetailRep;
    }
    getAllPlansDetail(planId) {
        return this.planDetailRep.find({
            where: {
                planId,
            },
            order: {
                planDetailDate: 'ASC',
            },
        });
    }
    createPlanDetail(params) {
        const newPlanDetail = this.planDetailRep.create(params);
        return this.planDetailRep.save(newPlanDetail);
    }
    async updatePlanDetail(id, params) {
        const oldPlan = await this.planDetailRep.findOne({
            where: {
                id,
            },
        });
        if (!oldPlan) {
            throw new common_1.NotFoundException('Note not found');
        }
        if (params.isComplete)
            oldPlan.isComplete = params.isComplete;
        oldPlan.planDetailPrice = params.planDetailPrice;
        oldPlan.planDetailDate = params.planDetailDate;
        return this.planDetailRep.save(oldPlan);
    }
    async deletePlanDetail(id) {
        const result = await this.planDetailRep.delete({ id });
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`PlanDetail ${id} not exists`);
        }
        return result;
    }
};
exports.DetailPlansService = DetailPlansService;
__decorate([
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DetailPlansService.prototype, "getAllPlansDetail", null);
__decorate([
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_detail_plan_dto_1.CreatePlanDetailDto]),
    __metadata("design:returntype", void 0)
], DetailPlansService.prototype, "createPlanDetail", null);
__decorate([
    __param(0, (0, common_1.Query)(':id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_detail_plan_dto_1.CreatePlanDetailDto]),
    __metadata("design:returntype", Promise)
], DetailPlansService.prototype, "updatePlanDetail", null);
__decorate([
    __param(0, (0, common_1.Query)(':id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DetailPlansService.prototype, "deletePlanDetail", null);
exports.DetailPlansService = DetailPlansService = __decorate([
    __param(0, (0, typeorm_1.InjectRepository)(planDetail_entity_1.PlanDetailEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DetailPlansService);
//# sourceMappingURL=planDetail.service.js.map