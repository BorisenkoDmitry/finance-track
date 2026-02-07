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
exports.PlansController = void 0;
const common_1 = require("@nestjs/common");
const user_docorator_1 = require("../auth/user.docorator");
const create_plan_dto_1 = require("./dto/create-plan.dto");
const update_plan_dto_1 = require("./dto/update-plan.dto");
const plan_service_1 = require("./plan.service");
const update_plan_checked_dto_1 = require("./dto/update-plan-checked.dto");
let PlansController = class PlansController {
    PlanService;
    constructor(PlanService) {
        this.PlanService = PlanService;
    }
    getAllPlanes(userId) {
        return this.PlanService.getAllPlans(userId);
    }
    createNewPlan(params, userId) {
        return this.PlanService.createPlan(params, userId);
    }
    updatePlanChecked(id, planCheckedDTO) {
        return this.PlanService.updatePlanChecked(id, planCheckedDTO);
    }
    updatePlan(params, userId) {
        return this.PlanService.updatePlant(params, userId);
    }
    deletePlan(id, userId) {
        return this.PlanService.deletePlan(id, userId);
    }
};
exports.PlansController = PlansController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PlansController.prototype, "getAllPlanes", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_plan_dto_1.CreatePlanDto, String]),
    __metadata("design:returntype", void 0)
], PlansController.prototype, "createNewPlan", null);
__decorate([
    (0, common_1.Put)('checked/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_plan_checked_dto_1.UpdatePlanCheckedDto]),
    __metadata("design:returntype", void 0)
], PlansController.prototype, "updatePlanChecked", null);
__decorate([
    (0, common_1.Patch)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_plan_dto_1.UpdatePlanDto, String]),
    __metadata("design:returntype", void 0)
], PlansController.prototype, "updatePlan", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PlansController.prototype, "deletePlan", null);
exports.PlansController = PlansController = __decorate([
    (0, common_1.Controller)('plan'),
    __metadata("design:paramtypes", [plan_service_1.PlansService])
], PlansController);
//# sourceMappingURL=plan.controller.js.map