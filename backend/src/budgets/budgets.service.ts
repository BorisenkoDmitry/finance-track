import {
  Body,
  Injectable,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrentUserID } from 'src/auth/user.docorator';
import { CatalogEntity } from 'src/catalogs/catalogs.entity';
import { Between, Repository } from 'typeorm';
import { Budgets } from './budgets.entity';
import { CreatedBudgetsDTO } from './dto/create-budgets.dto';
import { GetBudgetsDTO } from './dto/get-budgets.dto';
import { GetBudgetsSumDTO } from './dto/get-budget-sum.dto';

interface RawResult {
  total: number;
  day: string;
}

const getDaysInMonth = (date: string) => {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
};

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(Budgets) private budgetsRep: Repository<Budgets>,
    @InjectRepository(CatalogEntity)
    private catalogRep: Repository<CatalogEntity>,
  ) {}
  async getAllBudgets(
    @Query() GetBudgetsDTO: GetBudgetsDTO,
    @CurrentUserID() userId: string,
  ) {
    const { type } = GetBudgetsDTO;
    let arr: Budgets[] = [];
    if (type) {
      arr = await this.budgetsRep.find({
        order: {
          createdAt: 'ASC',
        },
        where: {
          type: type,
          dateCreated: Between(GetBudgetsDTO.dateStart, GetBudgetsDTO.dateEnd),
          userId,
        },
        relations: ['catalogItem'],
      });
    } else {
      arr = await this.budgetsRep.find({
        order: {
          createdAt: 'ASC',
        },
        where: {
          dateCreated: Between(GetBudgetsDTO.dateStart, GetBudgetsDTO.dateEnd),
          userId,
        },
        relations: ['catalogItem'],
      });
    }

    const newBudgets = arr.flatMap((x) => {
      const { catalogItem, ...other } = x;
      return { ...other, categoryName: catalogItem?.catalogName };
    });
    return newBudgets;
  }

  async getBudgetId(@Param('id') id: string, @CurrentUserID() userId: string) {
    const budget = await this.budgetsRep.findBy({ id, userId });
    if (!budget || budget.length === 0) {
      throw new NotFoundException('Budget not found');
    }

    return budget[0];
  }

  createBudget(
    @Body() budget: CreatedBudgetsDTO,
    @CurrentUserID() userId: string,
  ) {
    const newPost = this.budgetsRep.create({ ...budget, userId });
    return this.budgetsRep.save(newPost);
  }

  async updateBudget(
    @Param('id') id: string,
    @Body() budget: CreatedBudgetsDTO,
    @CurrentUserID() userId: string,
  ): Promise<Budgets> {
    const oldBudget = await this.getBudgetId(id, userId);

    if (!oldBudget) {
      throw new NotFoundException('Budget not found');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { categoryName, catalogId, ...other } = oldBudget;

    const editedPost = { ...other, ...budget };

    return await this.budgetsRep.save(editedPost);
  }

  async deleteBudget(
    @Param('id') id: string,
    @CurrentUserID() userId: string,
  ): Promise<void> {
    const result = await this.budgetsRep.delete({ id, userId });

    if (result.affected === 0) {
      throw new NotFoundException(`Budget ${id} not exists`);
    }
  }

  async getBudgetsSumRange(
    @CurrentUserID() userId: string,
    @Query() GetBudgetSumDto: GetBudgetsSumDTO,
  ) {
    const days: RawResult[] = await this.budgetsRep
      .createQueryBuilder('budgets')
      .select('DATE(budgets.dateCreated)', 'day')
      .addSelect('SUM(budgets.planned_amount)', 'total')

      .where('budgets.userId = :userId', { userId })
      .andWhere('budgets.catalogId = :catalogId', {
        catalogId: GetBudgetSumDto.catalogId,
      })
      .andWhere('budgets.dateCreated BETWEEN :start AND :end', {
        start: GetBudgetSumDto.dateStart,
        end: GetBudgetSumDto.dateEnd,
      })
      .groupBy('DATE(budgets.dateCreated)')
      .orderBy('DATE(budgets.dateCreated)', 'ASC')
      .getRawMany();
    const totalAcrossPeriod: { total: string } | undefined =
      await this.budgetsRep
        .createQueryBuilder('budgets')
        .select('SUM(budgets.planned_amount)', 'total')
        .where('budgets.userId = :userId', { userId })
        .andWhere('budgets.catalogId = :catalogId', {
          catalogId: GetBudgetSumDto.catalogId,
        })
        .andWhere('budgets.dateCreated BETWEEN :start AND :end', {
          start: GetBudgetSumDto.dateStart,
          end: GetBudgetSumDto.dateEnd,
        })
        .getRawOne();

    const totalForPeriod = totalAcrossPeriod?.total ?? 0;

    return {
      financeAnalitic: days.map((x) => {
        return {
          total: String(
            (
              Math.floor(Number(totalForPeriod)) / getDaysInMonth(x.day)
            ).toFixed(2),
          ),
          day: x.day,
        };
      }),
      totalPeriodBudgets: totalForPeriod,
    };
  }
}
