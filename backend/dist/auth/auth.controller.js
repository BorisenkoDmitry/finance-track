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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_entity_1 = require("./auth.entity");
const auth_service_1 = require("./auth.service");
const jwt_isPublic_1 = require("./authentication/jwt.isPublic");
const auth_create_dto_1 = require("./dto/auth-create.dto");
const auth_join_dto_1 = require("./dto/auth-join.dto");
const user_docorator_1 = require("./user.docorator");
const auth_change_pass_dto_1 = require("./dto/auth-change-pass.dto");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    findAll() {
        return this.authService.findAll();
    }
    findByEmail(email) {
        return this.authService.findByEmail(email);
    }
    findByPhone(phone) {
        return this.authService.findByPhone(phone);
    }
    createUser(createUserDTO) {
        return this.authService.createUser(createUserDTO);
    }
    logoutUser(user) {
        return this.authService.logout(user);
    }
    changeUserRole({ roleID, userID }) {
        return this.authService.changeUserRole({ roleID, userID });
    }
    async changePassword(params, userId) {
        return this.authService.changePassword(params, userId);
    }
    getMe(userId) {
        return this.authService.getMe(userId);
    }
    authJoin(params) {
        return this.authService.authJoin(params);
    }
    async deleteUserWithRelations(id) {
        return this.authService.deleteUserWithRelations(id);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('find-by-email/:email'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "findByEmail", null);
__decorate([
    (0, common_1.Get)('find-by-phone/:phone'),
    __param(0, (0, common_1.Param)('phone')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "findByPhone", null);
__decorate([
    (0, jwt_isPublic_1.Public)(),
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_create_dto_1.AuthCreateDTO]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "createUser", null);
__decorate([
    (0, common_1.Post)('logout'),
    __param(0, (0, user_docorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_entity_1.User]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logoutUser", null);
__decorate([
    (0, common_1.Post)('change-role'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "changeUserRole", null);
__decorate([
    (0, common_1.Post)('change-password'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_change_pass_dto_1.AuthChangePasswordDTO, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "changePassword", null);
__decorate([
    (0, common_1.Get)('/me'),
    __param(0, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getMe", null);
__decorate([
    (0, jwt_isPublic_1.Public)(),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_join_dto_1.AuthJoinDTO]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "authJoin", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "deleteUserWithRelations", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map