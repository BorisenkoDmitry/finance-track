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
exports.FinanceController = void 0;
const common_1 = require("@nestjs/common");
const user_docorator_1 = require("../auth/user.docorator");
const get_finance_dto_1 = require("./dto/get-finance.dto");
const finance_service_1 = require("./finance.service");
let FinanceController = class FinanceController {
    FinanceService;
    constructor(FinanceService) {
        this.FinanceService = FinanceService;
    }
    getRemainingFinance(userId) {
        return this.FinanceService.getExpInc(userId);
    }
    getFinanceExps(userId, getFinanceDto) {
        return this.FinanceService.getFinanceExps(userId, getFinanceDto);
    }
    getFinanceInc(userId, getFinanceDto) {
        return this.FinanceService.getFinanceInc(userId, getFinanceDto);
    }
};
exports.FinanceController = FinanceController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getRemainingFinance", null);
__decorate([
    (0, common_1.Get)('/range-exps'),
    __param(0, (0, user_docorator_1.CurrentUserID)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, get_finance_dto_1.GetFinanceDTO]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getFinanceExps", null);
__decorate([
    (0, common_1.Get)('/range-inc'),
    __param(0, (0, user_docorator_1.CurrentUserID)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, get_finance_dto_1.GetFinanceDTO]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getFinanceInc", null);
exports.FinanceController = FinanceController = __decorate([
    (0, common_1.Controller)('finance'),
    __metadata("design:paramtypes", [finance_service_1.FinanceService])
], FinanceController);
//# sourceMappingURL=finance.controller.js.map