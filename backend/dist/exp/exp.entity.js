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
exports.Exp = void 0;
const typeorm_1 = require("typeorm");
const expdetail_entity_1 = require("./expDetail/expdetail.entity");
const class_transformer_1 = require("class-transformer");
const auth_entity_1 = require("../auth/auth.entity");
const catalogs_entity_1 = require("../catalogs/catalogs.entity");
let Exp = class Exp {
    id;
    price;
    descr;
    date;
    createdAt;
    products;
    user;
    userId;
    catalogItem;
    catalogId;
};
exports.Exp = Exp;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Exp.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 13, scale: 2 }),
    __metadata("design:type", String)
], Exp.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Exp.prototype, "descr", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Exp.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp' }),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", Date)
], Exp.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => expdetail_entity_1.ExpDetail, (expDetail) => expDetail.exp),
    __metadata("design:type", Array)
], Exp.prototype, "products", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => auth_entity_1.User, (u) => u.exps, { cascade: true, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", auth_entity_1.User)
], Exp.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Exp.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => catalogs_entity_1.CatalogEntity, (u) => u.exps, {
        cascade: false,
        onDelete: 'SET NULL',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'catalogId' }),
    __metadata("design:type", catalogs_entity_1.CatalogEntity)
], Exp.prototype, "catalogItem", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        nullable: true,
    }),
    __metadata("design:type", String)
], Exp.prototype, "catalogId", void 0);
exports.Exp = Exp = __decorate([
    (0, typeorm_1.Entity)()
], Exp);
//# sourceMappingURL=exp.entity.js.map