import { Controller, Get, Query } from '@nestjs/common';
import { CurrentUserID } from 'src/auth/user.docorator';
import { GetFinanceDTO } from './dto/get-finance.dto';
import { FinanceService } from './finance.service';

@Controller('finance')
export class FinanceController {
  constructor(private readonly FinanceService: FinanceService) {}
  @Get()
  getRemainingFinance(@CurrentUserID() userId: string) {
    return this.FinanceService.getExpInc(userId);
  }

  @Get('/range-exps')
  getFinanceExps(
    @CurrentUserID() userId: string,
    @Query() getFinanceDto: GetFinanceDTO,
  ) {
    return this.FinanceService.getFinanceExps(userId, getFinanceDto);
  }

  @Get('/range-inc')
  getFinanceInc(
    @CurrentUserID() userId: string,
    @Query() getFinanceDto: GetFinanceDTO,
  ) {
    return this.FinanceService.getFinanceInc(userId, getFinanceDto);
  }
}
