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
import { Exp } from './exp.entity';
import { ExpService } from './exp.service';
import { GetExpDTO } from './dto/get-exp.dto';
import { GetExpFilterDTO } from './dto/get-exp-filter.dto';
import { CurrentUserID } from 'src/auth/user.docorator';

@Controller('exp')
export class ExpController {
  constructor(private readonly ExpService: ExpService) {}

  @Get()
  getAllExp(
    @Query() GetExpDTO: GetExpFilterDTO,
    @CurrentUserID() userId: string,
  ): Promise<Exp[]> {
    return this.ExpService.getAllExp(GetExpDTO, userId);
  }

  @Get(':id')
  getExpId(
    @Param('id') id: string,
    @CurrentUserID() userId: string,
  ): Promise<Exp | null> {
    return this.ExpService.getExpId(id, userId);
  }

  @Post()
  createExp(@Body() exp: GetExpDTO, @CurrentUserID() userId: string) {
    return this.ExpService.createExp(exp, userId);
  }

  @Patch(':id')
  updateExp(
    @Param('id') id: string,
    @Body() exp: GetExpDTO,
    @CurrentUserID() userId: string,
  ): Promise<void> {
    return this.ExpService.updateExp(id, exp, userId);
  }

  @Delete(':id')
  deleteExp(@Param('id') id: string, @CurrentUserID() userId: string) {
    return this.ExpService.deleteExp(id, userId);
  }
}
