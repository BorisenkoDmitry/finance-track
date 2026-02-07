import { InjectRepository } from '@nestjs/typeorm';
import { PlanDetailEntity } from './planDetail.entity';
import { Repository } from 'typeorm';
import { Body, NotFoundException, Query } from '@nestjs/common';
import { CreatePlanDetailDto } from './dto/create-detail-plan.dto';

export class DetailPlansService {
  constructor(
    @InjectRepository(PlanDetailEntity)
    private planDetailRep: Repository<PlanDetailEntity>,
  ) {}
  getAllPlansDetail(@Query() planId: string) {
    return this.planDetailRep.find({
      where: {
        planId,
      },
      order: {
        planDetailDate: 'ASC',
      },
    });
  }

  createPlanDetail(@Body() params: CreatePlanDetailDto) {
    const newPlanDetail = this.planDetailRep.create(params);
    return this.planDetailRep.save(newPlanDetail);
  }

  async updatePlanDetail(
    @Query(':id') id: string,
    @Body() params: CreatePlanDetailDto,
  ) {
    const oldPlan = await this.planDetailRep.findOne({
      where: {
        id,
      },
    });
    if (!oldPlan) {
      throw new NotFoundException('Note not found');
    }
    if (params.isComplete) oldPlan.isComplete = params.isComplete;
    oldPlan.planDetailPrice = params.planDetailPrice;
    oldPlan.planDetailDate = params.planDetailDate;

    return this.planDetailRep.save(oldPlan);
  }

  async deletePlanDetail(@Query(':id') id: string) {
    const result = await this.planDetailRep.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException(`PlanDetail ${id} not exists`);
    }

    return result;
  }
}
