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
exports.IncEntity = void 0;
const auth_entity_1 = require("../auth/auth.entity");
const typeorm_1 = require("typeorm");
let IncEntity = class IncEntity {
    id;
    date;
    source;
    sum;
    description;
    typeInc;
    method;
    user;
    userId;
};
exports.IncEntity = IncEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], IncEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], IncEntity.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], IncEntity.prototype, "source", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 13, scale: 2 }),
    __metadata("design:type", String)
], IncEntity.prototype, "sum", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], IncEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], IncEntity.prototype, "typeInc", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], IncEntity.prototype, "method", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => auth_entity_1.User, (u) => u.incs, { cascade: true, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", auth_entity_1.User)
], IncEntity.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], IncEntity.prototype, "userId", void 0);
exports.IncEntity = IncEntity = __decorate([
    (0, typeorm_1.Entity)()
], IncEntity);
//# sourceMappingURL=inc.entity.js.map