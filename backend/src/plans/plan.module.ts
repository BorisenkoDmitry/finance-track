import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanEntity } from './plan.entity';
import { PlanDetailEntity } from './planDetail/planDetail.entity';
import { PlansController } from './plan.controller';
import { PlansService } from './plan.service';
import { DetailPlansService } from './planDetail/planDetail.service';

@Module({
  imports: [TypeOrmModule.forFeature([PlanEntity, PlanDetailEntity])],
  controllers: [PlansController],
  providers: [PlansService, DetailPlansService],
})
export class PlanModule {}
