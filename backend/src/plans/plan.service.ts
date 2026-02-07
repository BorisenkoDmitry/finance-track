import {
  BadRequestException,
  Body,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrentUserID } from 'src/auth/user.docorator';
import { getMonthsDifference, printMonthsRange } from 'src/utils/plan';
import { Repository } from 'typeorm';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanCheckedDto } from './dto/update-plan-checked.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { PlanEntity } from './plan.entity';
import { PlanDetailEntity } from './planDetail/planDetail.entity';
import { DetailPlansService } from './planDetail/planDetail.service';

export class PlansService {
  constructor(
    @InjectRepository(PlanEntity) private planRep: Repository<PlanEntity>,
    @InjectRepository(PlanDetailEntity)
    private planDetailRep: Repository<PlanDetailEntity>,
    private readonly planDetailService: DetailPlansService,
  ) {}
  async getAllPlans(@CurrentUserID() userId: string) {
    const plans = await this.planRep.find({
      where: { userId },
      relations: ['detailPlans'],
      order: { planDate: 'ASC' },
    });

    // Сортируем detailPlans вручную
    plans.forEach((plan) => {
      plan.detailPlans.sort(
        (a, b) =>
          new Date(a.planDetailDatePay).getTime() -
          new Date(b.planDetailDatePay).getTime(),
      );
    });

    return plans.map((x) => {
      return {
        ...x,
        detailPlans: x.detailPlans.map((t) => {
          return { ...t, planDetailPrice: Number(t.planDetailPrice) };
        }),
        planPrice: Number(x.planPrice),
      };
    });
  }

  async createPlan(
    @Body() params: CreatePlanDto,
    @CurrentUserID() userId: string,
  ) {
    const newPlan = this.planRep.create({ ...params, userId });

    const startDate = new Date();
    const endDate = new Date(newPlan.planDate);
    if (endDate.getTime() - startDate.getTime() < 0) {
      throw new BadRequestException(`Укажите дату не раньше сегодняшней`);
    }
    const createdPlan = await this.planRep.save(newPlan);
    if (endDate.getTime() - startDate.getTime() > 0) {
      const rangeMonth = getMonthsDifference(startDate, endDate);
      const array = printMonthsRange(startDate, endDate);
      for (let i = 0; i < array.length; i++) {
        const createdPlanDetail = this.planDetailRep.create({
          planId: createdPlan.id,
          planDetailDatePay: array[i],
          planDetailDate: params.planDate,
          planDetailPrice: String(
            Math.floor(Number(newPlan.planPrice) / rangeMonth),
          ),
        });
        await this.planDetailRep.save(createdPlanDetail);
      }
    }

    return this.planRep.findOne({
      where: {
        userId,
        id: createdPlan.id,
      },
      relations: ['detailPlans'],
    });
  }

  async updatePlant(
    @Param() params: UpdatePlanDto,
    @CurrentUserID() userId: string,
  ) {
    const foundedPlan = await this.planRep.findOne({
      where: {
        id: params.planID,
        userId,
      },
    });
    if (!foundedPlan) {
      throw new NotFoundException('Plan not found');
    }

    const price =
      Number(foundedPlan.planPrice) - Number(params.planDetailPrice);

    if (price >= 0) {
      foundedPlan.planPrice = String(price);
      await this.planDetailService.updatePlanDetail(params.planDetailID, {
        isComplete: true,
        planDetailPrice: params.planDetailPrice,
        planDetailDate: new Date(),
      });

      const otherPlanDetail = foundedPlan.detailPlans.filter(
        (x) => x.id != params.planDetailID,
      );
      await Promise.all(
        otherPlanDetail.map((pl) => {
          return this.planDetailService.updatePlanDetail(pl.id, {
            isComplete: false,
            planDetailDate: pl.planDetailDate,
            planDetailPrice: String(Math.floor(price / otherPlanDetail.length)),
          });
        }),
      );
    } else {
      foundedPlan.planPrice = '0';
    }
    return this.planRep.save(foundedPlan);
  }

  async updatePlanChecked(
    @Param('id') id: string,
    @Body() planCheckedDTO: UpdatePlanCheckedDto,
  ) {
    const a = await this.planDetailRep.findOne({
      where: {
        id,
      },
    });
    if (!a) {
      throw new NotFoundException('PlanDetail not found');
    }
    a.isComplete = true;
    a.planDetailPrice = planCheckedDTO.price;
    const n = await this.planDetailRep.save(a);
    const plan = await this.planRep.findOne({
      where: {
        id: n.planId,
      },
      relations: ['detailPlans'],
    });
    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    const s = plan.detailPlans
      .filter((x) => x.isComplete)
      .reduce(
        (sum, next) =>
          sum + (next.planDetailPrice ? parseFloat(next.planDetailPrice) : 0),
        0,
      );

    if (
      parseFloat(plan.planPrice) <= parseFloat(planCheckedDTO.price) ||
      parseFloat(plan.planPrice) <= s
    ) {
      await Promise.all(
        plan.detailPlans.map((pl) => {
          return this.planDetailService.updatePlanDetail(pl.id, {
            isComplete: true,
            planDetailDate: pl.planDetailDate,
            planDetailPrice: pl.planDetailPrice,
          });
        }),
      );
      const pl = await this.planRep.save(plan);
      return pl;
    } else {
      const rangePrice =
        parseFloat(plan.planPrice) -
        plan.detailPlans
          .filter((x) => x.isComplete)
          .reduce(
            (sum, next) =>
              sum +
              (next.planDetailPrice ? parseFloat(next.planDetailPrice) : 0),
            0,
          );
      await Promise.all(
        plan.detailPlans
          .filter((x) => !x.isComplete)
          .map((pl) => {
            return this.planDetailService.updatePlanDetail(pl.id, {
              isComplete: false,
              planDetailDate: pl.planDetailDate,
              planDetailPrice: String(
                (
                  rangePrice /
                  plan.detailPlans.filter((x) => !x.isComplete).length
                ).toFixed(2),
              ),
            });
          }),
      );
      const pl = await this.planRep.save(plan);
      return pl;
    }
  }

  async deletePlan(@Param('id') id: string, @CurrentUserID() userId: string) {
    const result = await this.planRep.delete({ id, userId });

    if (result.affected === 0) {
      throw new NotFoundException(`Exp ${id} not exists`);
    }

    return {
      isDeleted: result.affected != 0,
    };
  }
}
