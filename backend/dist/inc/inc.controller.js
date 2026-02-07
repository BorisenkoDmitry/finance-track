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
exports.IncController = void 0;
const common_1 = require("@nestjs/common");
const get_inc_filter_1 = require("./dto/get-inc-filter");
const inc_service_1 = require("./inc.service");
const get_inc_dto_1 = require("./dto/get-inc-dto");
const user_docorator_1 = require("../auth/user.docorator");
let IncController = class IncController {
    IncServer;
    constructor(IncServer) {
        this.IncServer = IncServer;
    }
    getAllInc(GetIncDTO, userId) {
        return this.IncServer.getAllInc(GetIncDTO, userId);
    }
    getIncId(id, userId) {
        return this.IncServer.getIncId(id, userId);
    }
    createInc(inc, userId) {
        return this.IncServer.createInc(inc, userId);
    }
    updateExp(id, inc, userId) {
        return this.IncServer.updateExp(id, inc, userId);
    }
    deleteExp(id, userId) {
        return this.IncServer.deleteInc(id, userId);
    }
};
exports.IncController = IncController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_inc_filter_1.GetIncFilterDTO, String]),
    __metadata("design:returntype", Promise)
], IncController.prototype, "getAllInc", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], IncController.prototype, "getIncId", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_inc_dto_1.GetIncDTO, String]),
    __metadata("design:returntype", void 0)
], IncController.prototype, "createInc", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, get_inc_dto_1.GetIncDTO, String]),
    __metadata("design:returntype", Promise)
], IncController.prototype, "updateExp", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], IncController.prototype, "deleteExp", null);
exports.IncController = IncController = __decorate([
    (0, common_1.Controller)('inc'),
    __metadata("design:paramtypes", [inc_service_1.IncService])
], IncController);
//# sourceMappingURL=inc.controller.js.map