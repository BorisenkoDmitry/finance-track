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
import { GetExpDetailDTO } from './dto/get-exp-detail.dto';
import { ExpDetailService } from './expodetail.service';
import { CurrentUserID } from 'src/auth/user.docorator';

@Controller('expDetail')
export class ExpDetailController {
  constructor(private readonly ExpDetailService: ExpDetailService) {}

  @Get()
  getAll(
    @Query() { expID }: { expID: string },
    @CurrentUserID() userId: string,
  ) {
    return this.ExpDetailService.getAll({ expID }, userId);
  }

  @Get(':id')
  getId(
    @Param('id') id: string,
    @Query() { expID }: { expID: string },
    @CurrentUserID() userId: string,
  ) {
    return this.ExpDetailService.getId(id, { expID }, userId);
  }

  @Post()
  createExpDetail(
    @Body() { expID, expDetail }: { expID: string; expDetail: GetExpDetailDTO },
    @CurrentUserID() userId: string,
  ) {
    return this.ExpDetailService.createExpDetail(expID, expDetail, userId);
  }

  @Patch(':id')
  updateDetail(
    @Param('id') id: string,
    @Body() { expID, exp }: { expID: string; exp: GetExpDetailDTO },
    @CurrentUserID() userId: string,
  ) {
    return this.ExpDetailService.updateDetail(id, { expID, exp }, userId);
  }

  @Delete(':id')
  deleteExpDetail(
    @Param('id') id: string,
    @Body() { expID }: { expID: string },
    @CurrentUserID() userId: string,
  ) {
    return this.ExpDetailService.deleteExpDetail(id, expID, userId);
  }
}
