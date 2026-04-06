import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TagEntity } from './tags.entity';
import { CreateTagDTO } from './dto/create-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(TagEntity)
    private tagRep: Repository<TagEntity>,
  ) {}

  getAll(userId: string) {
    return this.tagRep.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  createTag(dto: CreateTagDTO, userId: string) {
    const tag = this.tagRep.create({ ...dto, userId });
    return this.tagRep.save(tag);
  }

  async updateTag(dto: CreateTagDTO, tagId: string, userId: string) {
    await this.tagRep.update({ id: tagId, userId }, dto);
    const tag = await this.tagRep.findOne({ where: { id: tagId, userId } });
    if (!tag) {
      throw new NotFoundException(`Tag ${tagId} not found`);
    }
    return tag;
  }

  async deleteTag(id: string, userId: string) {
    const result = await this.tagRep.delete({ id, userId });
    if (result.affected === 0) {
      throw new NotFoundException(`Tag ${id} not found`);
    }
    return result;
  }
}
