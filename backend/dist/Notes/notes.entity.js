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
exports.NoteEntity = void 0;
const class_transformer_1 = require("class-transformer");
const auth_entity_1 = require("../auth/auth.entity");
const typeorm_1 = require("typeorm");
let NoteEntity = class NoteEntity {
    id;
    createdAt;
    updateAt;
    completed;
    isDeleted;
    title;
    content;
    user;
    userId;
};
exports.NoteEntity = NoteEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], NoteEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], NoteEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp' }),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", Date)
], NoteEntity.prototype, "updateAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: false,
        type: 'boolean',
        name: 'is_completed',
    }),
    __metadata("design:type", Boolean)
], NoteEntity.prototype, "completed", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: false,
        type: 'boolean',
        name: 'is_deleted',
    }),
    __metadata("design:type", Boolean)
], NoteEntity.prototype, "isDeleted", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], NoteEntity.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
    }),
    __metadata("design:type", String)
], NoteEntity.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => auth_entity_1.User, (u) => u.notes, { cascade: true, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", auth_entity_1.User)
], NoteEntity.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", String)
], NoteEntity.prototype, "userId", void 0);
exports.NoteEntity = NoteEntity = __decorate([
    (0, typeorm_1.Entity)()
], NoteEntity);
//# sourceMappingURL=notes.entity.js.map