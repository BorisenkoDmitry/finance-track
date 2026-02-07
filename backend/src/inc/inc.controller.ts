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
import { GetIncFilterDTO } from './dto/get-inc-filter';
import { IncEntity } from './inc.entity';
import { IncService } from './inc.service';
import { GetIncDTO } from './dto/get-inc-dto';
import { CurrentUserID } from 'src/auth/user.docorator';

@Controller('inc')
export class IncController {
  constructor(private readonly IncServer: IncService) {}

  @Get()
  getAllInc(
    @Query() GetIncDTO: GetIncFilterDTO,
    @CurrentUserID() userId: string,
  ): Promise<IncEntity[]> {
    return this.IncServer.getAllInc(GetIncDTO, userId);
  }

  @Get(':id')
  getIncId(
    @Param('id') id: string,
    @CurrentUserID() userId: string,
  ): Promise<IncEntity | null> {
    return this.IncServer.getIncId(id, userId);
  }

  @Post()
  createInc(@Body() inc: GetIncDTO, @CurrentUserID() userId: string) {
    return this.IncServer.createInc(inc, userId);
  }

  @Patch(':id')
  updateExp(
    @Param('id') id: string,
    @Body() inc: GetIncDTO,
    @CurrentUserID() userId: string,
  ): Promise<IncEntity> {
    return this.IncServer.updateExp(id, inc, userId);
  }

  @Delete(':id')
  deleteExp(@Param('id') id: string, @CurrentUserID() userId: string) {
    return this.IncServer.deleteInc(id, userId);
  }
}
