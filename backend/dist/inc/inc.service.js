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
exports.IncService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const get_inc_dto_1 = require("./dto/get-inc-dto");
const get_inc_filter_1 = require("./dto/get-inc-filter");
const inc_entity_1 = require("./inc.entity");
const user_docorator_1 = require("../auth/user.docorator");
const get_inc_sum_dto_1 = require("./dto/get-inc-sum.dto");
const buildWhereFromParams = (params) => {
    const where = {};
    if (params.sum !== undefined && params.sum !== null) {
        const p = params.sum;
        if (!Number.isNaN(p) && Number(params.sum) != 0) {
            where.sum = p;
        }
    }
    return where;
};
let IncService = class IncService {
    incRep;
    constructor(incRep) {
        this.incRep = incRep;
    }
    getAllInc(GetIncDTO, userId) {
        console.log(GetIncDTO);
        return this.incRep.find({
            where: {
                date: (0, typeorm_2.Between)(GetIncDTO.dateStart, GetIncDTO.dateEnd),
                userId: userId,
                ...buildWhereFromParams(GetIncDTO),
            },
            order: {
                date: 'DESC',
            },
        });
    }
    getIncId(id, userId) {
        const inc = this.incRep.findOne({
            where: {
                id: id,
                userId: userId,
            },
        });
        return inc;
    }
    createInc(inc, userId) {
        const incNew = this.incRep.create({ ...inc, userId });
        return this.incRep.save(incNew);
    }
    async updateExp(id, inc, userId) {
        const oldInc = await this.getIncId(id, userId);
        if (!oldInc) {
            throw new common_1.NotFoundException('Inc not found');
        }
        const editedInc = { ...oldInc, ...inc };
        const res = await this.incRep.save(editedInc);
        return res;
    }
    async deleteInc(id, userId) {
        const result = await this.incRep.delete({ id, userId });
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Exp ${id} not exists`);
        }
        return result;
    }
    async getIncSumUser(userId) {
        const l = await this.incRep
            .createQueryBuilder('inc')
            .select('SUM(inc.sum)', 'total')
            .where('inc.userId = :userId', { userId })
            .getRawOne();
        return Number(l?.total ?? 0);
    }
    async getIncSumRange(userId, GetIncSumDto) {
        let incs = [];
        incs = await this.incRep.find({
            where: {
                userId,
                date: (0, typeorm_2.Between)(GetIncSumDto.dateStart, GetIncSumDto.dateEnd),
            },
        });
        return incs;
    }
};
exports.IncService = IncService;
__decorate([
    __param(0, (0, common_1.Query)()),
    __param(1, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_inc_filter_1.GetIncFilterDTO, String]),
    __metadata("design:returntype", Promise)
], IncService.prototype, "getAllInc", null);
__decorate([
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], IncService.prototype, "getIncId", null);
__decorate([
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_inc_dto_1.GetIncDTO, String]),
    __metadata("design:returntype", void 0)
], IncService.prototype, "createInc", null);
__decorate([
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, get_inc_dto_1.GetIncDTO, String]),
    __metadata("design:returntype", Promise)
], IncService.prototype, "updateExp", null);
__decorate([
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], IncService.prototype, "deleteInc", null);
__decorate([
    __param(0, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IncService.prototype, "getIncSumUser", null);
__decorate([
    __param(0, (0, user_docorator_1.CurrentUserID)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, get_inc_sum_dto_1.GetIncSumDTO]),
    __metadata("design:returntype", Promise)
], IncService.prototype, "getIncSumRange", null);
exports.IncService = IncService = __decorate([
    __param(0, (0, typeorm_1.InjectRepository)(inc_entity_1.IncEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], IncService);
//# sourceMappingURL=inc.service.js.map