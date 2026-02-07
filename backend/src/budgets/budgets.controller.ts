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
import { Budgets } from './budgets.entity';
import { BudgetService } from './budgets.service';
import { GetBudgetsDTO } from './dto/get-budgets.dto';
import { CreatedBudgetsDTO } from './dto/create-budgets.dto';
import { CurrentUserID } from 'src/auth/user.docorator';

@Controller('budgets')
export class BudgetsController {
  constructor(private readonly budgetService: BudgetService) {}

  @Get()
  getAllBudgets(
    @Query() GetBudgetsDTO: GetBudgetsDTO,
    @CurrentUserID() userId: string,
  ) {
    return this.budgetService.getAllBudgets(GetBudgetsDTO, userId);
  }

  @Get(':id')
  getBudgetId(
    @Param('id') id: string,
    @CurrentUserID() userId: string,
  ): Promise<Budgets> {
    return this.budgetService.getBudgetId(id, userId);
  }

  @Post()
  createBudget(
    @Body() budget: CreatedBudgetsDTO,
    @CurrentUserID() userId: string,
  ) {
    return this.budgetService.createBudget(budget, userId);
  }

  @Patch(':id')
  updateBudget(
    @Param('id') id: string,
    @Body() budget: CreatedBudgetsDTO,
    @CurrentUserID() userId: string,
  ): Promise<Budgets> {
    return this.budgetService.updateBudget(id, budget, userId);
  }

  @Delete(':id')
  deleteBudget(@Param('id') id: string, @CurrentUserID() userId: string) {
    return this.budgetService.deleteBudget(id, userId);
  }
}
