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
exports.ExpDetailService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const class_transformer_1 = require("class-transformer");
const typeorm_2 = require("typeorm");
const exp_entity_1 = require("../exp.entity");
const get_exp_detail_dto_1 = require("./dto/get-exp-detail.dto");
const expdetail_entity_1 = require("./expdetail.entity");
const user_docorator_1 = require("../../auth/user.docorator");
let ExpDetailService = class ExpDetailService {
    expDetailRep;
    expRep;
    constructor(expDetailRep, expRep) {
        this.expDetailRep = expDetailRep;
        this.expRep = expRep;
    }
    getAll({ expID }, userId) {
        return (0, class_transformer_1.instanceToPlain)(this.expDetailRep.find({
            where: {
                expId: expID,
                userId,
            },
        }));
    }
    getId(id, { expID }, userId) {
        return (0, class_transformer_1.instanceToPlain)(this.expDetailRep.findOne({
            where: {
                id: id,
                expId: expID,
                userId,
            },
        }));
    }
    async createExpDetail(expID, exp, userId) {
        const oldExp = await this.expRep.findOne({
            where: {
                id: expID,
                userId,
            },
        });
        const newExpDetail = this.expDetailRep.create({ ...exp, userId });
        if (oldExp) {
            newExpDetail.expId = expID;
        }
        return (0, class_transformer_1.instanceToPlain)(this.expDetailRep.save(newExpDetail));
    }
    async updateDetail(id, { expID, exp }, userId) {
        const expOldDetail = await this.expDetailRep.findOne({
            where: {
                id,
                expId: expID,
                userId,
            },
        });
        if (!expOldDetail) {
            throw new common_1.NotFoundException(`ExpDetail with ID ${id} not found`);
        }
        return (0, class_transformer_1.instanceToPlain)(this.expDetailRep.save({ ...expOldDetail, ...exp }));
    }
    async deleteExpDetail(id, expID, userId) {
        const result = await this.expDetailRep
            .createQueryBuilder()
            .delete()
            .from(expdetail_entity_1.ExpDetail)
            .where('id = :expDetailID', { expDetailID: id })
            .andWhere('expId = :expID', { expID })
            .andWhere('userId = :userID', { userID: userId })
            .execute();
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`ExpDetail ${id} not exists`);
        }
    }
};
exports.ExpDetailService = ExpDetailService;
__decorate([
    __param(0, (0, common_1.Query)()),
    __param(1, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ExpDetailService.prototype, "getAll", null);
__decorate([
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", void 0)
], ExpDetailService.prototype, "getId", null);
__decorate([
    __param(2, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, get_exp_detail_dto_1.GetExpDetailDTO, String]),
    __metadata("design:returntype", Promise)
], ExpDetailService.prototype, "createExpDetail", null);
__decorate([
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], ExpDetailService.prototype, "updateDetail", null);
__decorate([
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ExpDetailService.prototype, "deleteExpDetail", null);
exports.ExpDetailService = ExpDetailService = __decorate([
    __param(0, (0, typeorm_1.InjectRepository)(expdetail_entity_1.ExpDetail)),
    __param(1, (0, typeorm_1.InjectRepository)(exp_entity_1.Exp)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ExpDetailService);
//# sourceMappingURL=expodetail.service.js.map