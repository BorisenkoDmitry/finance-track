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
exports.AvatarService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const auth_entity_1 = require("../auth.entity");
const path_1 = require("path");
const promises_1 = require("fs/promises");
const fs_1 = require("fs");
const user_docorator_1 = require("../user.docorator");
const typeorm_2 = require("@nestjs/typeorm");
let AvatarService = class AvatarService {
    userRep;
    constructor(userRep) {
        this.userRep = userRep;
    }
    AVATAR_DIR = (0, path_1.join)(__dirname, '..', '..', '..', 'public', 'avatars');
    async uploadAvatar(userId, file) {
        console.log(this.AVATAR_DIR);
        const ext = file.originalname.split('.').pop();
        const filename = `user-${userId}.${ext}`;
        const filepath = (0, path_1.join)(this.AVATAR_DIR, filename);
        if (!(0, fs_1.existsSync)(this.AVATAR_DIR)) {
            await (0, promises_1.mkdir)(this.AVATAR_DIR, { recursive: true });
        }
        const writeStream = (0, fs_1.createWriteStream)(filepath);
        writeStream.write(file.buffer);
        writeStream.end();
        await this.userRep.update(userId, {
            avatarPath: `avatars/${filename}`,
        });
        const user = await this.userRep.findOne({
            where: {
                id: userId,
            },
            relations: ['roles'],
        });
        if (!user) {
            return;
        }
        const { email, id, name, surname, roles } = user;
        return {
            user: {
                email,
                id,
                name,
                surname,
                roles,
                imageUrl: `avatars/${filename}?v=${Date.now()}`,
            },
        };
    }
    async deleteAvatar(userId) {
        const user = await this.userRep.findOne({
            where: { id: userId },
            relations: ['roles'],
        });
        if (!user?.avatarPath) {
            return;
        }
        const filepath = (0, path_1.join)(this.AVATAR_DIR, user.avatarPath);
        try {
            if ((0, fs_1.existsSync)(filepath)) {
                await (0, promises_1.unlink)(filepath);
                console.log(`Файл удалён: ${filepath}`);
            }
            else {
                console.warn(`Файл не найден на диске: ${filepath}`);
            }
            await this.userRep.update(userId, { avatarPath: null });
            const { email, id, name, surname, roles } = user;
            return {
                user: { email, id, name, surname, roles, imageUrl: null },
            };
        }
        catch (error) {
            console.error('Ошибка при удалении аватара:', error);
            throw new Error('Не удалось удалить аватар');
        }
    }
};
exports.AvatarService = AvatarService;
__decorate([
    __param(0, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AvatarService.prototype, "uploadAvatar", null);
__decorate([
    __param(0, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AvatarService.prototype, "deleteAvatar", null);
exports.AvatarService = AvatarService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(auth_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], AvatarService);
//# sourceMappingURL=avatarUser.service.js.map