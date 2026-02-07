import { InjectRepository } from '@nestjs/typeorm';
import { NoteEntity } from './notes.entity';
import { Between, Repository } from 'typeorm';
import { Body, NotFoundException, Param, Query } from '@nestjs/common';
import { CurrentUserID } from 'src/auth/user.docorator';
import { GetNoteDTO, isDeletedEnum } from './dto/get-note-dto';
import { CreateNoteDTO } from './dto/create-note-dto';
import { UpdateNoteDTO } from './dto/update-note-dto';

export class NotesService {
  constructor(
    @InjectRepository(NoteEntity) private noteRep: Repository<NoteEntity>,
  ) {}

  getAllNotes(
    @Query() GetNoteDTO: GetNoteDTO,
    @CurrentUserID() userId: string,
  ): Promise<NoteEntity[]> {
    return this.noteRep.find({
      order: {
        createdAt: 'DESC',
      },
      where: {
        userId,
        createdAt: Between(GetNoteDTO.dateStart, GetNoteDTO.dateEnd),
        title: GetNoteDTO.title,
        isDeleted:
          GetNoteDTO.isDeleted === isDeletedEnum.all
            ? undefined
            : Boolean(GetNoteDTO.isDeleted),
      },
    });
  }

  getNoteId(@Param('id') id: string, @CurrentUserID() userId: string) {
    const inc = this.noteRep.findOne({
      where: {
        id: id,
        userId: userId,
      },
    });
    return inc;
  }

  createNote(
    @Body() CreateNoteDTO: CreateNoteDTO,
    @CurrentUserID() userId: string,
  ) {
    const noteNew = this.noteRep.create({
      ...CreateNoteDTO,
      completed: false,
      isDeleted: false,
      userId,
    });
    return this.noteRep.save(noteNew);
  }

  async updateNote(
    @Param('id') id: string,
    @Body() note: UpdateNoteDTO,
    @CurrentUserID() userId: string,
  ) {
    const oldNote = await this.getNoteId(id, userId);
    if (!oldNote) {
      throw new NotFoundException('Note not found');
    }
    console.log(oldNote);
    console.log(note);
    const editedNote = {
      ...oldNote,
      title: note.title ? note.title : oldNote.title,
      content: note.content ? note.content : oldNote.content,
      completed:
        note.completed === undefined ? oldNote.completed : note.completed,
      isDeleted:
        note.isDeleted === undefined ? oldNote.isDeleted : note.isDeleted,
    };
    const res = await this.noteRep.save(editedNote);
    return res;
  }

  async deleteNote(@Param('id') id: string, @CurrentUserID() userId: string) {
    const oldNote = await this.getNoteId(id, userId);
    if (!oldNote) {
      throw new NotFoundException('Note not found');
    }
    return this.noteRep.save({ ...oldNote, isDeleted: true });
  }
  async deleteNoteAlways(
    @Param('id') id: string,
    @CurrentUserID() userId: string,
  ) {
    const result = await this.noteRep.delete({ id, userId });
    if (result.affected === 0) {
      throw new NotFoundException(`Note ${id} not exists`);
    }

    return result;
  }
}
