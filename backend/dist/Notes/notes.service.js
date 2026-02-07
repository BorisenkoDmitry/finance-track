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
exports.NotesService = void 0;
const typeorm_1 = require("@nestjs/typeorm");
const notes_entity_1 = require("./notes.entity");
const typeorm_2 = require("typeorm");
const common_1 = require("@nestjs/common");
const user_docorator_1 = require("../auth/user.docorator");
const get_note_dto_1 = require("./dto/get-note-dto");
const create_note_dto_1 = require("./dto/create-note-dto");
const update_note_dto_1 = require("./dto/update-note-dto");
let NotesService = class NotesService {
    noteRep;
    constructor(noteRep) {
        this.noteRep = noteRep;
    }
    getAllNotes(GetNoteDTO, userId) {
        return this.noteRep.find({
            order: {
                createdAt: 'DESC',
            },
            where: {
                userId,
                createdAt: (0, typeorm_2.Between)(GetNoteDTO.dateStart, GetNoteDTO.dateEnd),
                title: GetNoteDTO.title,
                isDeleted: GetNoteDTO.isDeleted === get_note_dto_1.isDeletedEnum.all
                    ? undefined
                    : Boolean(GetNoteDTO.isDeleted),
            },
        });
    }
    getNoteId(id, userId) {
        const inc = this.noteRep.findOne({
            where: {
                id: id,
                userId: userId,
            },
        });
        return inc;
    }
    createNote(CreateNoteDTO, userId) {
        const noteNew = this.noteRep.create({
            ...CreateNoteDTO,
            completed: false,
            isDeleted: false,
            userId,
        });
        return this.noteRep.save(noteNew);
    }
    async updateNote(id, note, userId) {
        const oldNote = await this.getNoteId(id, userId);
        if (!oldNote) {
            throw new common_1.NotFoundException('Note not found');
        }
        console.log(oldNote);
        console.log(note);
        const editedNote = {
            ...oldNote,
            title: note.title ? note.title : oldNote.title,
            content: note.content ? note.content : oldNote.content,
            completed: note.completed === undefined ? oldNote.completed : note.completed,
            isDeleted: note.isDeleted === undefined ? oldNote.isDeleted : note.isDeleted,
        };
        const res = await this.noteRep.save(editedNote);
        return res;
    }
    async deleteNote(id, userId) {
        const oldNote = await this.getNoteId(id, userId);
        if (!oldNote) {
            throw new common_1.NotFoundException('Note not found');
        }
        return this.noteRep.save({ ...oldNote, isDeleted: true });
    }
    async deleteNoteAlways(id, userId) {
        const result = await this.noteRep.delete({ id, userId });
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Note ${id} not exists`);
        }
        return result;
    }
};
exports.NotesService = NotesService;
__decorate([
    __param(0, (0, common_1.Query)()),
    __param(1, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_note_dto_1.GetNoteDTO, String]),
    __metadata("design:returntype", Promise)
], NotesService.prototype, "getAllNotes", null);
__decorate([
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], NotesService.prototype, "getNoteId", null);
__decorate([
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_note_dto_1.CreateNoteDTO, String]),
    __metadata("design:returntype", void 0)
], NotesService.prototype, "createNote", null);
__decorate([
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_note_dto_1.UpdateNoteDTO, String]),
    __metadata("design:returntype", Promise)
], NotesService.prototype, "updateNote", null);
__decorate([
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], NotesService.prototype, "deleteNote", null);
__decorate([
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_docorator_1.CurrentUserID)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], NotesService.prototype, "deleteNoteAlways", null);
exports.NotesService = NotesService = __decorate([
    __param(0, (0, typeorm_1.InjectRepository)(notes_entity_1.NoteEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], NotesService);
//# sourceMappingURL=notes.service.js.map