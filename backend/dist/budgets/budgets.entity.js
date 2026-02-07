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
exports.Budgets = void 0;
const typeorm_1 = require("typeorm");
const get_budgets_dto_1 = require("./dto/get-budgets.dto");
const auth_entity_1 = require("../auth/auth.entity");
const catalogs_entity_1 = require("../catalogs/catalogs.entity");
let Budgets = class Budgets {
    id;
    categoryName;
    color;
    comment;
    dateCreated;
    period;
    planned_amount;
    type;
    createdAt;
    user;
    userId;
    catalogItem;
    catalogId;
};
exports.Budgets = Budgets;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Budgets.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Budgets.prototype, "categoryName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Budgets.prototype, "color", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Budgets.prototype, "comment", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", String)
], Budgets.prototype, "dateCreated", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Budgets.prototype, "period", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 13, scale: 2 }),
    __metadata("design:type", String)
], Budgets.prototype, "planned_amount", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Budgets.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Budgets.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => auth_entity_1.User, (u) => u.budgets, {
        cascade: true,
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", auth_entity_1.User)
], Budgets.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Budgets.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => catalogs_entity_1.CatalogEntity, (u) => u.budgets, {
        cascade: false,
        onDelete: 'SET NULL',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'catalogId' }),
    __metadata("design:type", catalogs_entity_1.CatalogEntity)
], Budgets.prototype, "catalogItem", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        nullable: true,
    }),
    __metadata("design:type", String)
], Budgets.prototype, "catalogId", void 0);
exports.Budgets = Budgets = __decorate([
    (0, typeorm_1.Entity)()
], Budgets);
//# sourceMappingURL=budgets.entity.js.map