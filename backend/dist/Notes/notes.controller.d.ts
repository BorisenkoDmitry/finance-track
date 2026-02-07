import { NotesService } from './notes.service';
import { GetNoteDTO } from './dto/get-note-dto';
import { NoteEntity } from './notes.entity';
import { CreateNoteDTO } from './dto/create-note-dto';
import { UpdateNoteDTO } from './dto/update-note-dto';
export declare class NotesController {
    private readonly NotesService;
    constructor(NotesService: NotesService);
    getAllNotes(GetNoteDto: GetNoteDTO, userId: string): Promise<NoteEntity[]>;
    createNote(CreateNoteDto: CreateNoteDTO, userId: string): Promise<NoteEntity>;
    updateNote(id: string, note: UpdateNoteDTO, userId: string): Promise<{
        title: string;
        content: string;
        completed: boolean;
        isDeleted: boolean;
        id: string;
        createdAt: Date;
        updateAt: Date;
        user: import("../auth/auth.entity").User;
        userId: string;
    } & NoteEntity>;
    deleteNote(id: string, userId: string): Promise<{
        isDeleted: true;
        id: string;
        createdAt: Date;
        updateAt: Date;
        completed: boolean;
        title: string;
        content: string;
        user: import("../auth/auth.entity").User;
        userId: string;
    } & NoteEntity>;
    deleteNoteAlways(id: string, userId: string): Promise<import("typeorm").DeleteResult>;
}
