import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CurrentUserID } from 'src/auth/user.docorator';
import { GetNoteDTO } from './dto/get-note-dto';
import { NoteEntity } from './notes.entity';
import { CreateNoteDTO } from './dto/create-note-dto';
import { UpdateNoteDTO } from './dto/update-note-dto';

@Controller('notes')
export class NotesController {
  constructor(private readonly NotesService: NotesService) {}

  @Get()
  getAllNotes(
    @Query() GetNoteDto: GetNoteDTO,
    @CurrentUserID() userId: string,
  ): Promise<NoteEntity[]> {
    return this.NotesService.getAllNotes(GetNoteDto, userId);
  }

  @Post()
  createNote(
    @Body() CreateNoteDto: CreateNoteDTO,
    @CurrentUserID() userId: string,
  ) {
    return this.NotesService.createNote(CreateNoteDto, userId);
  }

  @Patch(':id')
  async updateNote(
    @Param('id') id: string,
    @Body() note: UpdateNoteDTO,
    @CurrentUserID() userId: string,
  ) {
    return this.NotesService.updateNote(id, note, userId);
  }

  @Delete('to-history/:id')
  deleteNote(@Param('id') id: string, @CurrentUserID() userId: string) {
    return this.NotesService.deleteNote(id, userId);
  }

  @Delete(':id')
  deleteNoteAlways(@Param('id') id: string, @CurrentUserID() userId: string) {
    return this.NotesService.deleteNoteAlways(id, userId);
  }
}
