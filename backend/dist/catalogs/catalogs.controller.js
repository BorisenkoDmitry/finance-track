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
exports.CatalogsController = void 0;
const common_1 = require("@nestjs/common");
const user_docorator_1 = require("../auth/user.docorator");
const catalogs_service_1 = require("./catalogs.service");
const create_catalog_dto_1 = require("./dto/create-catalog-dto");
const get_catalogs_dto_1 = require("./dto/get-catalogs.dto");
let CatalogsController = class CatalogsController {
    CatalogsService;
    constructor(CatalogsService) {
        this.CatalogsService = CatalogsService;
    }
    getAll(GetCatalogsDTO, id) {
        return this.CatalogsService.getAll(GetCatalogsDTO, id);
    }
    createCatalog(CreateCatalogDTO, id) {
        return this.CatalogsService.createCatalog(CreateCatalogDTO, id);
    }
    updateCatalog(CreateCatalogDTO, catalogId, id) {
        return this.CatalogsService.updateCatalog(CreateCatalogDTO, catalogId, id);
    }
    async deleteCatalog(id, userId) {
        return this.CatalogsService.deleteCatalog(id, userId);
    }
};
exports.CatalogsController = CatalogsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_catalogs_dto_1.GetCatalogsDTO, String]),
    __metadata("design:returntype", void 0)
], CatalogsController.prototype, "getAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_catalog_dto_1.CreateCatalogDTO, String]),
    __metadata("design:returntype", void 0)
], CatalogsController.prototype, "createCatalog", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_catalog_dto_1.CreateCatalogDTO, String, String]),
    __metadata("design:returntype", void 0)
], CatalogsController.prototype, "updateCatalog", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CatalogsController.prototype, "deleteCatalog", null);
exports.CatalogsController = CatalogsController = __decorate([
    (0, common_1.Controller)('catalogs'),
    __metadata("design:paramtypes", [catalogs_service_1.CatalogsService])
], CatalogsController);
//# sourceMappingURL=catalogs.controller.js.map