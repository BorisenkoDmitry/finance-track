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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const bcryptjs_1 = require("bcryptjs");
const dayjs_1 = __importDefault(require("dayjs"));
const roles_entity_1 = require("../roles/roles.entity");
const typeorm_2 = require("typeorm");
const uuid_1 = require("uuid");
const auth_entity_1 = require("./auth.entity");
const auth_create_dto_1 = require("./dto/auth-create.dto");
const auth_join_dto_1 = require("./dto/auth-join.dto");
const token_entity_1 = require("./token/token.entity");
const user_docorator_1 = require("./user.docorator");
const catalogs_service_1 = require("../catalogs/catalogs.service");
const catalogs_static_1 = require("../catalogs/catalogs.static");
const auth_change_pass_dto_1 = require("./dto/auth-change-pass.dto");
let AuthService = class AuthService {
    userRep;
    roleRepo;
    tokenRepo;
    jwtService;
    CatalogService;
    constructor(userRep, roleRepo, tokenRepo, jwtService, CatalogService) {
        this.userRep = userRep;
        this.roleRepo = roleRepo;
        this.tokenRepo = tokenRepo;
        this.jwtService = jwtService;
        this.CatalogService = CatalogService;
    }
    findAll() {
        return this.userRep.find({
            relations: ['roles'],
        });
    }
    hashPassword(password) {
        return (0, bcryptjs_1.hashSync)(password, (0, bcryptjs_1.genSaltSync)(10));
    }
    async findByEmail(email, isCreated) {
        const user = await this.userRep.findOne({
            where: {
                email,
            },
            relations: ['roles'],
        });
        if (!isCreated) {
            if (!user || user === null) {
                throw new common_1.ConflictException(`User not found with this email: ${email}`);
            }
        }
        return user;
    }
    async findById(id, isCreated) {
        const user = await this.userRep.findOne({
            where: {
                id,
            },
            relations: ['roles'],
        });
        if (!isCreated) {
            if (!user || user === null) {
                throw new common_1.ConflictException(`User not found with this id: ${id}`);
            }
        }
        return user;
    }
    async findByPhone(phone, isCreated) {
        const user = await this.userRep.findOne({
            where: {
                phone,
            },
            relations: ['roles'],
        });
        if (!isCreated) {
            if (!user || user === null) {
                throw new common_1.ConflictException(`User not found with this phone: ${phone}`);
            }
        }
        return user;
    }
    async createUser(userCreate) {
        const { password, ...user } = userCreate;
        const hashPassword = this.hashPassword(password);
        let role = null;
        role = await this.roleRepo.findOne({
            where: {
                name: 'BetaUser',
            },
        });
        const conflictingPhone = await this.findByPhone(user.phone, true);
        if (conflictingPhone) {
            throw new common_1.ConflictException(`Phone ${user.phone} уже занят`);
        }
        const conflictingEmail = await this.findByEmail(user.email, true);
        if (conflictingEmail) {
            throw new common_1.ConflictException(`Email ${user.email} уже занят`);
        }
        if (!role) {
            throw new common_1.NotFoundException('Role not found');
        }
        user.roles = [...(user.roles ?? []), role];
        const userNew = this.userRep.create({
            ...user,
            password: hashPassword,
        });
        await this.userRep.save(userNew).catch(() => {
            throw new common_1.BadRequestException('Ошибка при создании пользователя');
        });
        await Promise.all(catalogs_static_1.CatalogStatic.map((x) => this.CatalogService.createCatalog(x, userNew.id)));
        return userNew;
    }
    async changePassword(params, userId) {
        const user = await this.findById(userId, false);
        if (!user) {
            throw new common_1.BadRequestException(`Такого пользователя не существует`);
        }
        const isPassSuccess = (0, bcryptjs_1.compareSync)(params.oldPassword, user.password);
        if (!isPassSuccess) {
            throw new common_1.BadRequestException(`Неверный текущий пароль`);
        }
        if (params.newPassword != params.newPasswordRepeat) {
            throw new common_1.BadRequestException(`Новый и повторный пароли не совпадают`);
        }
        const hashPassword = this.hashPassword(params.newPassword);
        await this.userRep.save({ ...user, password: hashPassword });
        const { email, id, name, surname, roles, avatarPath } = user;
        return {
            result: true,
            user: { email, id, name, surname, roles, imageUrl: avatarPath },
        };
    }
    async authJoin(params) {
        const { email, password } = params;
        const user = await this.findByEmail(email, true);
        if (!user) {
            throw new common_1.UnauthorizedException(`Неверная почта`);
        }
        const isPassSuccess = (0, bcryptjs_1.compareSync)(password, user.password);
        if (!isPassSuccess) {
            throw new common_1.UnauthorizedException(`Неверная пароль`);
        }
        const accessToken = this.jwtService.sign({
            id: user.id,
            name: user.name,
            surname: user.surname,
            email: user.email,
            roles: user.roles,
        }, { expiresIn: '1h' });
        const refreshToken = await this.GetRefreshToken(user.id);
        return {
            accessToken: accessToken,
            refreshToken: refreshToken,
            user,
        };
    }
    async getMe(userId) {
        const user = await this.userRep.findOne({
            where: { id: userId },
            relations: ['roles'],
        });
        if (!user) {
            return;
        }
        const { email, id, name, surname, roles, avatarPath } = user;
        return {
            result: true,
            user: { email, id, name, surname, roles, imageUrl: avatarPath },
        };
    }
    GetRefreshToken(userID) {
        const currentDate = (0, dayjs_1.default)();
        const expireDate = currentDate.add(1, 'month').toDate();
        const tokenData = this.tokenRepo.create({
            token: (0, uuid_1.v4)(),
            exp: expireDate,
            userId: userID,
        });
        return this.tokenRepo.save(tokenData);
    }
    logout(user) {
        this.jwtService.sign(user, { expiresIn: '0.5s' });
    }
    async changeUserRole({ roleID, userID }) {
        const user = await this.findById(userID, false);
        if (!user) {
            throw new common_1.BadRequestException(`Такого пользователя не существует`);
        }
        const role = await this.roleRepo.findOne({
            where: {
                id: roleID,
            },
        });
        if (!role) {
            throw new common_1.BadRequestException(`Такой роли не существует`);
        }
        await this.userRep.save({ ...user, roles: [role] }).catch((err) => {
            throw new common_1.BadRequestException(`Не удалось изменить роль ${err}`);
        });
        return { result: true };
    }
    async deleteUserWithRelations(id) {
        const user = await this.userRep.findOne({
            where: { id },
            relations: [
                'roles',
                'tokens',
                'catalogs',
                'budgets',
                'incs',
                'exps',
                'expDetails',
            ],
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        await this.userRep.remove(user);
    }
};
exports.AuthService = AuthService;
__decorate([
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", Promise)
], AuthService.prototype, "findByEmail", null);
__decorate([
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", Promise)
], AuthService.prototype, "findById", null);
__decorate([
    __param(0, (0, common_1.Param)('phone')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", Promise)
], AuthService.prototype, "findByPhone", null);
__decorate([
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_create_dto_1.AuthCreateDTO]),
    __metadata("design:returntype", Promise)
], AuthService.prototype, "createUser", null);
__decorate([
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_change_pass_dto_1.AuthChangePasswordDTO, String]),
    __metadata("design:returntype", Promise)
], AuthService.prototype, "changePassword", null);
__decorate([
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_join_dto_1.AuthJoinDTO]),
    __metadata("design:returntype", Promise)
], AuthService.prototype, "authJoin", null);
__decorate([
    __param(0, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthService.prototype, "getMe", null);
__decorate([
    __param(0, (0, user_docorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_entity_1.User]),
    __metadata("design:returntype", void 0)
], AuthService.prototype, "logout", null);
__decorate([
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthService.prototype, "changeUserRole", null);
__decorate([
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthService.prototype, "deleteUserWithRelations", null);
exports.AuthService = AuthService = __decorate([
    __param(0, (0, typeorm_1.InjectRepository)(auth_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(roles_entity_1.Role)),
    __param(2, (0, typeorm_1.InjectRepository)(token_entity_1.Token)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService,
        catalogs_service_1.CatalogsService])
], AuthService);
//# sourceMappingURL=auth.service.js.map