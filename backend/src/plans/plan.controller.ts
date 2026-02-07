import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { CurrentUserID } from 'src/auth/user.docorator';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { PlansService } from './plan.service';
import { UpdatePlanCheckedDto } from './dto/update-plan-checked.dto';

@Controller('plan')
export class PlansController {
  constructor(private readonly PlanService: PlansService) {}

  @Get()
  getAllPlanes(@CurrentUserID() userId: string) {
    return this.PlanService.getAllPlans(userId);
  }

  @Post()
  createNewPlan(
    @Body() params: CreatePlanDto,
    @CurrentUserID() userId: string,
  ) {
    return this.PlanService.createPlan(params, userId);
  }

  @Put('checked/:id')
  updatePlanChecked(
    @Param('id') id: string,
    @Body() planCheckedDTO: UpdatePlanCheckedDto,
  ) {
    return this.PlanService.updatePlanChecked(id, planCheckedDTO);
  }

  @Patch()
  updatePlan(@Body() params: UpdatePlanDto, @CurrentUserID() userId: string) {
    return this.PlanService.updatePlant(params, userId);
  }

  @Delete(':id')
  deletePlan(@Param('id') id: string, @CurrentUserID() userId: string) {
    return this.PlanService.deletePlan(id, userId);
  }

  //   @Post()
  //   createNote(
  //     @Body() CreateNoteDto: CreateNoteDTO,
  //     @CurrentUserID() userId: string,
  //   ) {
  //     return this.NotesService.createNote(CreateNoteDto, userId);
  //   }

  //   @Patch(':id')
  //   async updateNote(
  //     @Param('id') id: string,
  //     @Body() note: UpdateNoteDTO,
  //     @CurrentUserID() userId: string,
  //   ) {
  //     return this.NotesService.updateNote(id, note, userId);
  //   }

  //   @Delete('to-history/:id')
  //   deleteNote(@Param('id') id: string, @CurrentUserID() userId: string) {
  //     return this.NotesService.deleteNote(id, userId);
  //   }

  //   @Delete(':id')
  //   deleteNoteAlways(@Param('id') id: string, @CurrentUserID() userId: string) {
  //     return this.NotesService.deleteNoteAlways(id, userId);
  //   }
}
