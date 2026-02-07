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
exports.GetNoteDTO = exports.isDeletedEnum = void 0;
const class_validator_1 = require("class-validator");
var isDeletedEnum;
(function (isDeletedEnum) {
    isDeletedEnum[isDeletedEnum["no"] = 0] = "no";
    isDeletedEnum[isDeletedEnum["yes"] = 1] = "yes";
    isDeletedEnum[isDeletedEnum["all"] = 2] = "all";
})(isDeletedEnum || (exports.isDeletedEnum = isDeletedEnum = {}));
class GetNoteDTO {
    title;
    dateStart;
    dateEnd;
    isDeleted;
}
exports.GetNoteDTO = GetNoteDTO;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GetNoteDTO.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], GetNoteDTO.prototype, "dateStart", void 0);
__decorate([
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], GetNoteDTO.prototype, "dateEnd", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(isDeletedEnum),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], GetNoteDTO.prototype, "isDeleted", void 0);
//# sourceMappingURL=get-note-dto.js.map