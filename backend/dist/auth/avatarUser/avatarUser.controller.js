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
exports.AvatarController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const avatarUser_service_1 = require("./avatarUser.service");
const user_docorator_1 = require("../user.docorator");
let AvatarController = class AvatarController {
    avatarService;
    constructor(avatarService) {
        this.avatarService = avatarService;
    }
    upload(file, userId) {
        return this.avatarService.uploadAvatar(userId, file);
    }
    delete(userId) {
        return this.avatarService.deleteAvatar(userId);
    }
};
exports.AvatarController = AvatarController;
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AvatarController.prototype, "upload", null);
__decorate([
    (0, common_1.Delete)('delete'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AvatarController.prototype, "delete", null);
exports.AvatarController = AvatarController = __decorate([
    (0, common_1.Controller)('avatar'),
    __metadata("design:paramtypes", [avatarUser_service_1.AvatarService])
], AvatarController);
//# sourceMappingURL=avatarUser.controller.js.map