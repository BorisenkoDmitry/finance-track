import { Module } from '@nestjs/common';
import { BudgetsController } from './budgets.controller';
import { BudgetService } from './budgets.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Budgets } from './budgets.entity';
import { CatalogEntity } from 'src/catalogs/catalogs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Budgets, CatalogEntity])],
  controllers: [BudgetsController],
  providers: [BudgetService],
})
export class BudgetsModule {}
