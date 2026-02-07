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
exports.User = void 0;
const roles_entity_1 = require("../roles/roles.entity");
const typeorm_1 = require("typeorm");
const token_entity_1 = require("./token/token.entity");
const catalogs_entity_1 = require("../catalogs/catalogs.entity");
const budgets_entity_1 = require("../budgets/budgets.entity");
const inc_entity_1 = require("../inc/inc.entity");
const exp_entity_1 = require("../exp/exp.entity");
const expdetail_entity_1 = require("../exp/expDetail/expdetail.entity");
const notes_entity_1 = require("../Notes/notes.entity");
const plan_entity_1 = require("../plans/plan.entity");
let User = class User {
    id;
    email;
    phone;
    name;
    surname;
    password;
    avatarPath;
    roles;
    tokens;
    catalogs;
    budgets;
    incs;
    exps;
    expDetails;
    notes;
    plans;
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "surname", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, default: null }),
    __metadata("design:type", Object)
], User.prototype, "avatarPath", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => roles_entity_1.Role, (role) => role.users, { cascade: true }),
    (0, typeorm_1.JoinTable)({
        name: 'user_roles',
        joinColumn: {
            name: 'user_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'role_id',
            referencedColumnName: 'id',
        },
    }),
    __metadata("design:type", Array)
], User.prototype, "roles", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => token_entity_1.Token, (token) => token.user),
    __metadata("design:type", Array)
], User.prototype, "tokens", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => catalogs_entity_1.CatalogEntity, (t) => t.user),
    __metadata("design:type", Array)
], User.prototype, "catalogs", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => budgets_entity_1.Budgets, (t) => t.user),
    __metadata("design:type", Array)
], User.prototype, "budgets", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => inc_entity_1.IncEntity, (t) => t.user),
    __metadata("design:type", Array)
], User.prototype, "incs", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => exp_entity_1.Exp, (t) => t.user),
    __metadata("design:type", Array)
], User.prototype, "exps", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => expdetail_entity_1.ExpDetail, (t) => t.user),
    __metadata("design:type", Array)
], User.prototype, "expDetails", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => notes_entity_1.NoteEntity, (t) => t.user),
    __metadata("design:type", Array)
], User.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => plan_entity_1.PlanEntity, (t) => t.user),
    __metadata("design:type", Array)
], User.prototype, "plans", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)({ name: 'users' }),
    (0, typeorm_1.Unique)(['phone']),
    (0, typeorm_1.Unique)(['email'])
], User);
//# sourceMappingURL=auth.entity.js.map