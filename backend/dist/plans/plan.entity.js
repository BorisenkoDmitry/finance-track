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
exports.PlanEntity = void 0;
const class_transformer_1 = require("class-transformer");
const auth_entity_1 = require("../auth/auth.entity");
const typeorm_1 = require("typeorm");
const planDetail_entity_1 = require("./planDetail/planDetail.entity");
let PlanEntity = class PlanEntity {
    id;
    createdAt;
    updateAt;
    planDate;
    planName;
    planPrice;
    planColor;
    user;
    userId;
    detailPlans;
};
exports.PlanEntity = PlanEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PlanEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], PlanEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp' }),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", Date)
], PlanEntity.prototype, "updateAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], PlanEntity.prototype, "planDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], PlanEntity.prototype, "planName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 13, scale: 2 }),
    (0, class_transformer_1.Transform)(({ value }) => Number(value)),
    __metadata("design:type", String)
], PlanEntity.prototype, "planPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', default: null }),
    __metadata("design:type", String)
], PlanEntity.prototype, "planColor", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => auth_entity_1.User, (u) => u.plans, { cascade: true, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", auth_entity_1.User)
], PlanEntity.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", String)
], PlanEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => planDetail_entity_1.PlanDetailEntity, (t) => t.plan),
    __metadata("design:type", Array)
], PlanEntity.prototype, "detailPlans", void 0);
exports.PlanEntity = PlanEntity = __decorate([
    (0, typeorm_1.Entity)()
], PlanEntity);
//# sourceMappingURL=plan.entity.js.map