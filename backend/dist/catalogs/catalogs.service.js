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
exports.CatalogsService = void 0;
const typeorm_1 = require("@nestjs/typeorm");
const catalogs_entity_1 = require("./catalogs.entity");
const typeorm_2 = require("typeorm");
const common_1 = require("@nestjs/common");
const get_catalogs_dto_1 = require("./dto/get-catalogs.dto");
const create_catalog_dto_1 = require("./dto/create-catalog-dto");
const user_docorator_1 = require("../auth/user.docorator");
let CatalogsService = class CatalogsService {
    catalogRep;
    constructor(catalogRep) {
        this.catalogRep = catalogRep;
    }
    getAll(GetCatalogsDTO, id) {
        return this.catalogRep.find({
            order: {
                createdAt: 'DESC',
            },
            where: {
                catalogType: GetCatalogsDTO.type,
                userId: id,
            },
        });
    }
    async getCatalogExps(id, startDate, endDate) {
        const qb = this.catalogRep
            .createQueryBuilder('catalog')
            .leftJoinAndSelect('catalog.exps', 'exp')
            .where('catalog.catalogType = :type', { type: catalogs_entity_1.TypeCatalog.exp })
            .andWhere('catalog.userId = :id', { id });
        if (startDate && endDate) {
            qb.andWhere('exp.date BETWEEN :startDate AND :endDate', {
                startDate,
                endDate,
            });
        }
        else if (startDate) {
            qb.andWhere('exp.date >= :startDate', { startDate });
        }
        else if (endDate) {
            qb.andWhere('exp.date <= :endDate', { endDate });
        }
        const catalogs = await qb.getMany();
        const allExps = catalogs.flatMap((c) => c.exps ?? []);
        return allExps;
    }
    createCatalog(CreateCatalogDTO, id) {
        const catalogNew = this.catalogRep.create({
            ...CreateCatalogDTO,
            userId: id,
        });
        return this.catalogRep.save(catalogNew);
    }
    async updateCatalog(CreateCatalogDTO, catalogId, id) {
        console.log(catalogId);
        const oldExp = await this.catalogRep.update({
            id: catalogId,
            userId: id,
        }, CreateCatalogDTO);
        if (!oldExp) {
            throw new common_1.NotFoundException(`Catalog with ID ${catalogId} not found`);
        }
        return this.catalogRep.findOne({ where: { id: catalogId, userId: id } });
    }
    async deleteCatalog(id, userId) {
        const result = await this.catalogRep.delete({ id, userId });
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Catalog ${id} not exists`);
        }
        return result;
    }
};
exports.CatalogsService = CatalogsService;
__decorate([
    __param(0, (0, common_1.Query)()),
    __param(1, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_catalogs_dto_1.GetCatalogsDTO, String]),
    __metadata("design:returntype", void 0)
], CatalogsService.prototype, "getAll", null);
__decorate([
    __param(0, (0, user_docorator_1.CurrentUserID)()),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], CatalogsService.prototype, "getCatalogExps", null);
__decorate([
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_catalog_dto_1.CreateCatalogDTO, String]),
    __metadata("design:returntype", void 0)
], CatalogsService.prototype, "createCatalog", null);
__decorate([
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_catalog_dto_1.CreateCatalogDTO, String, String]),
    __metadata("design:returntype", Promise)
], CatalogsService.prototype, "updateCatalog", null);
__decorate([
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CatalogsService.prototype, "deleteCatalog", null);
exports.CatalogsService = CatalogsService = __decorate([
    __param(0, (0, typeorm_1.InjectRepository)(catalogs_entity_1.CatalogEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CatalogsService);
//# sourceMappingURL=catalogs.service.js.map