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
exports.ExpService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_docorator_1 = require("../auth/user.docorator");
const catalogs_entity_1 = require("../catalogs/catalogs.entity");
const typeorm_2 = require("typeorm");
const get_exp_filter_dto_1 = require("./dto/get-exp-filter.dto");
const get_exp_dto_1 = require("./dto/get-exp.dto");
const exp_entity_1 = require("./exp.entity");
const get_exp_sum_dto_1 = require("./expDetail/dto/get-exp-sum.dto");
const expdetail_entity_1 = require("./expDetail/expdetail.entity");
const buildWhereFromParams = (params) => {
    const where = {};
    if (params.price !== undefined && params.price !== null) {
        const p = params.price;
        if (!Number.isNaN(p) && Number(params.price) != 0) {
            where.price = p;
        }
    }
    if (params.descr != undefined && params.descr.length > 0) {
        where.descr = (0, typeorm_2.ILike)(`%${params.descr}%`);
    }
    return where;
};
let ExpService = class ExpService {
    expRep;
    expDetailRep;
    catalogRep;
    constructor(expRep, expDetailRep, catalogRep) {
        this.expRep = expRep;
        this.expDetailRep = expDetailRep;
        this.catalogRep = catalogRep;
    }
    async getAllExp(GetExpDTO, userId) {
        const a = await this.expRep.find({
            where: {
                date: (0, typeorm_2.Between)(GetExpDTO.dateStart, GetExpDTO.dateEnd),
                userId,
                ...buildWhereFromParams(GetExpDTO),
                catalogItem: {
                    id: GetExpDTO.categoryId
                        ? GetExpDTO.categoryId?.length > 0
                            ? GetExpDTO.categoryId
                            : undefined
                        : undefined,
                },
            },
            relations: ['products', 'catalogItem'],
            order: {
                date: 'DESC',
            },
        });
        const exps = a.flatMap((x) => {
            const { catalogItem, ...other } = x;
            return { ...other, categoryName: catalogItem?.catalogName };
        });
        return exps;
    }
    getExpId(id, userId) {
        const exp = this.expRep.findOne({
            where: {
                id: id,
                userId,
            },
            relations: ['products', 'catalogItem'],
        });
        return exp;
    }
    createExp(exp, userId) {
        const expNew = this.expRep.create({ ...exp, userId });
        return this.expRep.save(expNew);
    }
    async updateExp(id, exp, userId) {
        const oldExp = await this.getExpId(id, userId);
        if (!oldExp) {
            throw new common_1.NotFoundException('Exp not found');
        }
        const { catalogId, catalogItem, ...other } = oldExp;
        const editedExp = { ...other, ...exp };
        await this.expRep.save(editedExp);
    }
    async deleteExp(id, userId) {
        const result = await this.expRep.delete({ id, userId });
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Exp ${id} not exists`);
        }
        return result;
    }
    async getExpSumUser(userId) {
        const l = await this.expRep
            .createQueryBuilder('exp')
            .select('SUM(exp.price)', 'total')
            .where('exp.userId = :userId', { userId })
            .getRawOne();
        return Number(l?.total ?? 0);
    }
    async getExpSumRange(userId, GetExpSumDto) {
        const days = await this.expRep
            .createQueryBuilder('exp')
            .select('DATE(exp.date)', 'day')
            .addSelect('SUM(exp.price)', 'total')
            .where('exp.userId = :userId', { userId })
            .andWhere('exp.catalogId = :catalogId', {
            catalogId: GetExpSumDto.catalogId,
        })
            .andWhere('exp.date BETWEEN :start AND :end', {
            start: GetExpSumDto.dateStart,
            end: GetExpSumDto.dateEnd,
        })
            .groupBy('DATE(exp.date)')
            .orderBy('DATE(exp.date)', 'ASC')
            .getRawMany();
        const totalAcrossPeriod = await this.expRep
            .createQueryBuilder('exp')
            .select('SUM(exp.price)', 'total')
            .where('exp.userId = :userId', { userId })
            .andWhere('exp.catalogId = :catalogId', {
            catalogId: GetExpSumDto.catalogId,
        })
            .andWhere('exp.date BETWEEN :start AND :end', {
            start: GetExpSumDto.dateStart,
            end: GetExpSumDto.dateEnd,
        })
            .getRawOne();
        const totalForPeriod = totalAcrossPeriod?.total ?? 0;
        return {
            financeAnalitic: days.map((x) => {
                return { total: x.total, day: x.day };
            }),
            totalPeriodExp: totalForPeriod,
        };
    }
};
exports.ExpService = ExpService;
__decorate([
    __param(0, (0, common_1.Query)()),
    __param(1, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_exp_filter_dto_1.GetExpFilterDTO, String]),
    __metadata("design:returntype", Promise)
], ExpService.prototype, "getAllExp", null);
__decorate([
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ExpService.prototype, "getExpId", null);
__decorate([
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_exp_dto_1.GetExpDTO, String]),
    __metadata("design:returntype", void 0)
], ExpService.prototype, "createExp", null);
__decorate([
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, get_exp_dto_1.GetExpDTO, String]),
    __metadata("design:returntype", Promise)
], ExpService.prototype, "updateExp", null);
__decorate([
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ExpService.prototype, "deleteExp", null);
__decorate([
    __param(0, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ExpService.prototype, "getExpSumUser", null);
__decorate([
    __param(0, (0, user_docorator_1.CurrentUserID)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, get_exp_sum_dto_1.GetExpSumDTO]),
    __metadata("design:returntype", Promise)
], ExpService.prototype, "getExpSumRange", null);
exports.ExpService = ExpService = __decorate([
    __param(0, (0, typeorm_1.InjectRepository)(exp_entity_1.Exp)),
    __param(1, (0, typeorm_1.InjectRepository)(expdetail_entity_1.ExpDetail)),
    __param(2, (0, typeorm_1.InjectRepository)(catalogs_entity_1.CatalogEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ExpService);
//# sourceMappingURL=exp.service.js.map