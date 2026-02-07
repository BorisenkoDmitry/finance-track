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
exports.ExpDetail = void 0;
const typeorm_1 = require("typeorm");
const exp_entity_1 = require("../exp.entity");
const class_transformer_1 = require("class-transformer");
const auth_entity_1 = require("../../auth/auth.entity");
let ExpDetail = class ExpDetail {
    id;
    name;
    price;
    count;
    createdAt;
    expId;
    exp;
    user;
    userId;
};
exports.ExpDetail = ExpDetail;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ExpDetail.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ExpDetail.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 13, scale: 2 }),
    __metadata("design:type", String)
], ExpDetail.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ExpDetail.prototype, "count", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp' }),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", Date)
], ExpDetail.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'exp_id' }),
    __metadata("design:type", String)
], ExpDetail.prototype, "expId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => exp_entity_1.Exp, (exp) => exp.products, {
        cascade: true,
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'exp_id' }),
    __metadata("design:type", exp_entity_1.Exp)
], ExpDetail.prototype, "exp", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => auth_entity_1.User, (u) => u.expDetails, {
        cascade: true,
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", auth_entity_1.User)
], ExpDetail.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ExpDetail.prototype, "userId", void 0);
exports.ExpDetail = ExpDetail = __decorate([
    (0, typeorm_1.Entity)()
], ExpDetail);
//# sourceMappingURL=expdetail.entity.js.map