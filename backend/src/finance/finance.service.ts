import { NotFoundException, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrentUserID } from 'src/auth/user.docorator';
import { Budgets } from 'src/budgets/budgets.entity';
import { BudgetService } from 'src/budgets/budgets.service';
import { CatalogEntity } from 'src/catalogs/catalogs.entity';
import { Exp } from 'src/exp/exp.entity';
import { ExpService } from 'src/exp/exp.service';
import { IncEntity } from 'src/inc/inc.entity';
import { IncService } from 'src/inc/inc.service';
import { getMonthlyResult } from 'src/utils/financeMonths';
import { Between, Repository } from 'typeorm';
import { GetFinanceDTO } from './dto/get-finance.dto';

export class FinanceService {
  constructor(
    @InjectRepository(Exp) private ExpRep: Repository<Exp>,
    @InjectRepository(IncEntity) private IncRep: Repository<IncEntity>,
    @InjectRepository(CatalogEntity)
    private CatalogRep: Repository<CatalogEntity>,
    @InjectRepository(Budgets) private BudgetsRep: Repository<Budgets>,
    private ExpService: ExpService,
    private IncService: IncService,
    private BudgetsService: BudgetService,
  ) {}

  async getExpInc(@CurrentUserID() userId: string) {
    const exps = await this.ExpService.getExpSumUser(userId);
    const incs = await this.IncService.getIncSumUser(userId);
    return {
      total: incs - exps,
    };
  }

  async getFinanceExps(
    @CurrentUserID() userId: string,
    @Query() getFinanceDto: GetFinanceDTO,
  ) {
    const exps = await this.ExpService.getExpSumRange(userId, getFinanceDto);
    const budgets = await this.BudgetsService.getBudgetsSumRange(
      userId,
      getFinanceDto,
    );
    const catalogItem = await this.CatalogRep.findOne({
      where: {
        id: getFinanceDto.catalogId,
      },
    });

    if (!catalogItem) {
      throw new NotFoundException(
        `Catalog ${getFinanceDto.catalogId} not exists`,
      );
    }

    return {
      exps,
      budgets,
      catalogName: catalogItem.catalogName,
      catalogType: catalogItem.catalogType,
      catalogColor: catalogItem.catalogColor,
    };
  }

  async getFinanceInc(
    @CurrentUserID() userId: string,
    @Query() getFinanceDto: GetFinanceDTO,
  ) {
    // const incs = await this.IncRep.find({
    //   where: {
    //     userId,
    //   },
    // });
    const incs = await this.IncRep.find({
      where: {
        date: Between(getFinanceDto.dateStart, getFinanceDto.dateEnd),
        userId,
      },
    });
    const exps = await this.ExpRep.find({
      where: {
        date: Between(getFinanceDto.dateStart, getFinanceDto.dateEnd),
        userId,
      },
    });
    const budgets = await this.BudgetsRep.find({
      where: {
        createdAt: Between(getFinanceDto.dateStart, getFinanceDto.dateEnd),
        type: 1,
        userId,
      },
      relations: ['catalogItem'],
    });

    return getMonthlyResult(
      exps,
      incs,
      budgets,
      getFinanceDto.dateStart,
      getFinanceDto.dateEnd,
    );
  }
}
