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
exports.GetBudgetsDTO = exports.CategoryType = void 0;
const class_validator_1 = require("class-validator");
var CategoryType;
(function (CategoryType) {
    CategoryType[CategoryType["inc"] = 1] = "inc";
    CategoryType[CategoryType["exp"] = 2] = "exp";
    CategoryType[CategoryType["source"] = 3] = "source";
    CategoryType[CategoryType["pay"] = 4] = "pay";
    CategoryType[CategoryType["all"] = 5] = "all";
})(CategoryType || (exports.CategoryType = CategoryType = {}));
class GetBudgetsDTO {
    dateStart;
    dateEnd;
    type;
}
exports.GetBudgetsDTO = GetBudgetsDTO;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GetBudgetsDTO.prototype, "dateStart", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GetBudgetsDTO.prototype, "dateEnd", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(CategoryType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], GetBudgetsDTO.prototype, "type", void 0);
//# sourceMappingURL=get-budgets.dto.js.map