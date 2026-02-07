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
exports.CatalogEntity = exports.TypeCatalog = void 0;
const class_transformer_1 = require("class-transformer");
const auth_entity_1 = require("../auth/auth.entity");
const budgets_entity_1 = require("../budgets/budgets.entity");
const exp_entity_1 = require("../exp/exp.entity");
const typeorm_1 = require("typeorm");
var TypeCatalog;
(function (TypeCatalog) {
    TypeCatalog[TypeCatalog["inc"] = 1] = "inc";
    TypeCatalog[TypeCatalog["exp"] = 2] = "exp";
    TypeCatalog[TypeCatalog["source"] = 3] = "source";
    TypeCatalog[TypeCatalog["pay"] = 4] = "pay";
})(TypeCatalog || (exports.TypeCatalog = TypeCatalog = {}));
let CatalogEntity = class CatalogEntity {
    id;
    catalogName;
    catalogColor;
    catalogType;
    createdAt;
    user;
    userId;
    exps;
    budgets;
};
exports.CatalogEntity = CatalogEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CatalogEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CatalogEntity.prototype, "catalogName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        default: null,
    }),
    __metadata("design:type", String)
], CatalogEntity.prototype, "catalogColor", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TypeCatalog,
    }),
    __metadata("design:type", Number)
], CatalogEntity.prototype, "catalogType", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp' }),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", Date)
], CatalogEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => auth_entity_1.User, (u) => u.catalogs, {
        cascade: true,
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", auth_entity_1.User)
], CatalogEntity.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CatalogEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => exp_entity_1.Exp, (t) => t.catalogItem),
    __metadata("design:type", Array)
], CatalogEntity.prototype, "exps", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => budgets_entity_1.Budgets, (t) => t.catalogItem),
    __metadata("design:type", Array)
], CatalogEntity.prototype, "budgets", void 0);
exports.CatalogEntity = CatalogEntity = __decorate([
    (0, typeorm_1.Entity)()
], CatalogEntity);
//# sourceMappingURL=catalogs.entity.js.map