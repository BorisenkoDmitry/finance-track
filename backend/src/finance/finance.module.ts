import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exp } from 'src/exp/exp.entity';
import { IncEntity } from 'src/inc/inc.entity';
import { FinanceController } from './finance.controller';
import { FinanceService } from './finance.service';
import { ExpService } from 'src/exp/exp.service';
import { IncService } from 'src/inc/inc.service';
import { ExpDetail } from 'src/exp/expDetail/expdetail.entity';
import { CatalogEntity } from 'src/catalogs/catalogs.entity';
import { BudgetService } from 'src/budgets/budgets.service';
import { Budgets } from 'src/budgets/budgets.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      IncEntity,
      Exp,
      ExpDetail,
      CatalogEntity,
      Budgets,
    ]),
  ],
  controllers: [FinanceController],
  providers: [FinanceService, ExpService, IncService, BudgetService],
})
export class FinanceModule {}
