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
exports.ExpDetailController = void 0;
const common_1 = require("@nestjs/common");
const expodetail_service_1 = require("./expodetail.service");
const user_docorator_1 = require("../../auth/user.docorator");
let ExpDetailController = class ExpDetailController {
    ExpDetailService;
    constructor(ExpDetailService) {
        this.ExpDetailService = ExpDetailService;
    }
    getAll({ expID }, userId) {
        return this.ExpDetailService.getAll({ expID }, userId);
    }
    getId(id, { expID }, userId) {
        return this.ExpDetailService.getId(id, { expID }, userId);
    }
    createExpDetail({ expID, expDetail }, userId) {
        return this.ExpDetailService.createExpDetail(expID, expDetail, userId);
    }
    updateDetail(id, { expID, exp }, userId) {
        return this.ExpDetailService.updateDetail(id, { expID, exp }, userId);
    }
    deleteExpDetail(id, { expID }, userId) {
        return this.ExpDetailService.deleteExpDetail(id, expID, userId);
    }
};
exports.ExpDetailController = ExpDetailController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ExpDetailController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", void 0)
], ExpDetailController.prototype, "getId", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ExpDetailController.prototype, "createExpDetail", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", void 0)
], ExpDetailController.prototype, "updateDetail", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", void 0)
], ExpDetailController.prototype, "deleteExpDetail", null);
exports.ExpDetailController = ExpDetailController = __decorate([
    (0, common_1.Controller)('expDetail'),
    __metadata("design:paramtypes", [expodetail_service_1.ExpDetailService])
], ExpDetailController);
//# sourceMappingURL=expdetail.controller.js.map