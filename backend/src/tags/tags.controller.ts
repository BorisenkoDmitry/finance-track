import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CurrentUserID } from 'src/auth/user.docorator';
import { TagsService } from './tags.service';
import { CreateTagDTO } from './dto/create-tag.dto';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  getAll(@CurrentUserID() userId: string) {
    return this.tagsService.getAll(userId);
  }

  @Post()
  create(@Body() dto: CreateTagDTO, @CurrentUserID() userId: string) {
    return this.tagsService.createTag(dto, userId);
  }

  @Patch(':id')
  update(
    @Body() dto: CreateTagDTO,
    @Param('id') tagId: string,
    @CurrentUserID() userId: string,
  ) {
    return this.tagsService.updateTag(dto, tagId, userId);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @CurrentUserID() userId: string) {
    return this.tagsService.deleteTag(id, userId);
  }
}
