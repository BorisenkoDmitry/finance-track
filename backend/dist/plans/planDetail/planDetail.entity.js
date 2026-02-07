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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanDetailEntity = void 0;
const class_transformer_1 = require("class-transformer");
const typeorm_1 = require("typeorm");
const plan_entity_1 = require("../plan.entity");
let PlanDetailEntity = class PlanDetailEntity {
    id;
    createdAt;
    updateAt;
    planDetailDatePay;
    planDetailDate;
    planDetailPrice;
    isComplete;
    plan;
    planId;
};
exports.PlanDetailEntity = PlanDetailEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PlanDetailEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], PlanDetailEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp' }),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", Date)
], PlanDetailEntity.prototype, "updateAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: null }),
    __metadata("design:type", Date)
], PlanDetailEntity.prototype, "planDetailDatePay", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], PlanDetailEntity.prototype, "planDetailDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 13, scale: 2 }),
    (0, class_transformer_1.Transform)(({ value }) => Number(value)),
    __metadata("design:type", String)
], PlanDetailEntity.prototype, "planDetailPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], PlanDetailEntity.prototype, "isComplete", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => plan_entity_1.PlanEntity, (u) => u.detailPlans, {
        cascade: true,
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'planId' }),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", plan_entity_1.PlanEntity)
], PlanDetailEntity.prototype, "plan", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", String)
], PlanDetailEntity.prototype, "planId", void 0);
exports.PlanDetailEntity = PlanDetailEntity = __decorate([
    (0, typeorm_1.Entity)()
], PlanDetailEntity);
//# sourceMappingURL=planDetail.entity.js.map