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
exports.CreatedBudgetsDTO = void 0;
const class_validator_1 = require("class-validator");
const get_budgets_dto_1 = require("./get-budgets.dto");
class CreatedBudgetsDTO {
    categoryName;
    color;
    comment;
    period;
    planned_amount;
    dateCreated;
    catalogId;
    type;
}
exports.CreatedBudgetsDTO = CreatedBudgetsDTO;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatedBudgetsDTO.prototype, "categoryName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatedBudgetsDTO.prototype, "color", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatedBudgetsDTO.prototype, "comment", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatedBudgetsDTO.prototype, "period", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatedBudgetsDTO.prototype, "planned_amount", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatedBudgetsDTO.prototype, "dateCreated", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatedBudgetsDTO.prototype, "catalogId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(get_budgets_dto_1.CategoryType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreatedBudgetsDTO.prototype, "type", void 0);
//# sourceMappingURL=create-budgets.dto.js.map