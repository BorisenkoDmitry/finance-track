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
exports.NotesController = void 0;
const common_1 = require("@nestjs/common");
const notes_service_1 = require("./notes.service");
const user_docorator_1 = require("../auth/user.docorator");
const get_note_dto_1 = require("./dto/get-note-dto");
const create_note_dto_1 = require("./dto/create-note-dto");
const update_note_dto_1 = require("./dto/update-note-dto");
let NotesController = class NotesController {
    NotesService;
    constructor(NotesService) {
        this.NotesService = NotesService;
    }
    getAllNotes(GetNoteDto, userId) {
        return this.NotesService.getAllNotes(GetNoteDto, userId);
    }
    createNote(CreateNoteDto, userId) {
        return this.NotesService.createNote(CreateNoteDto, userId);
    }
    async updateNote(id, note, userId) {
        return this.NotesService.updateNote(id, note, userId);
    }
    deleteNote(id, userId) {
        return this.NotesService.deleteNote(id, userId);
    }
    deleteNoteAlways(id, userId) {
        return this.NotesService.deleteNoteAlways(id, userId);
    }
};
exports.NotesController = NotesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_note_dto_1.GetNoteDTO, String]),
    __metadata("design:returntype", Promise)
], NotesController.prototype, "getAllNotes", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_note_dto_1.CreateNoteDTO, String]),
    __metadata("design:returntype", void 0)
], NotesController.prototype, "createNote", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_note_dto_1.UpdateNoteDTO, String]),
    __metadata("design:returntype", Promise)
], NotesController.prototype, "updateNote", null);
__decorate([
    (0, common_1.Delete)('to-history/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], NotesController.prototype, "deleteNote", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], NotesController.prototype, "deleteNoteAlways", null);
exports.NotesController = NotesController = __decorate([
    (0, common_1.Controller)('notes'),
    __metadata("design:paramtypes", [notes_service_1.NotesService])
], NotesController);
//# sourceMappingURL=notes.controller.js.map