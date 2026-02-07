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
exports.ExpController = void 0;
const common_1 = require("@nestjs/common");
const exp_service_1 = require("./exp.service");
const get_exp_dto_1 = require("./dto/get-exp.dto");
const get_exp_filter_dto_1 = require("./dto/get-exp-filter.dto");
const user_docorator_1 = require("../auth/user.docorator");
let ExpController = class ExpController {
    ExpService;
    constructor(ExpService) {
        this.ExpService = ExpService;
    }
    getAllExp(GetExpDTO, userId) {
        return this.ExpService.getAllExp(GetExpDTO, userId);
    }
    getExpId(id, userId) {
        return this.ExpService.getExpId(id, userId);
    }
    createExp(exp, userId) {
        return this.ExpService.createExp(exp, userId);
    }
    updateExp(id, exp, userId) {
        return this.ExpService.updateExp(id, exp, userId);
    }
    deleteExp(id, userId) {
        return this.ExpService.deleteExp(id, userId);
    }
};
exports.ExpController = ExpController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_exp_filter_dto_1.GetExpFilterDTO, String]),
    __metadata("design:returntype", Promise)
], ExpController.prototype, "getAllExp", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ExpController.prototype, "getExpId", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_exp_dto_1.GetExpDTO, String]),
    __metadata("design:returntype", void 0)
], ExpController.prototype, "createExp", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, get_exp_dto_1.GetExpDTO, String]),
    __metadata("design:returntype", Promise)
], ExpController.prototype, "updateExp", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ExpController.prototype, "deleteExp", null);
exports.ExpController = ExpController = __decorate([
    (0, common_1.Controller)('exp'),
    __metadata("design:paramtypes", [exp_service_1.ExpService])
], ExpController);
//# sourceMappingURL=exp.controller.js.map