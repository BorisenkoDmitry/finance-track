import { GetFinanceDTO } from './dto/get-finance.dto';
import { FinanceService } from './finance.service';
export declare class FinanceController {
    private readonly FinanceService;
    constructor(FinanceService: FinanceService);
    getRemainingFinance(userId: string): Promise<{
        total: number;
    }>;
    getFinanceExps(userId: string, getFinanceDto: GetFinanceDTO): Promise<{
        exps: {
            financeAnalitic: {
                total: number;
                day: string;
            }[];
            totalPeriodExp: string | number;
        };
        budgets: {
            financeAnalitic: {
                total: string;
                day: string;
            }[];
            totalPeriodBudgets: string | number;
        };
        catalogName: string;
        catalogType: import("../catalogs/catalogs.entity").TypeCatalog;
        catalogColor: string;
    }>;
    getFinanceInc(userId: string, getFinanceDto: GetFinanceDTO): Promise<{
        filters: {
            dateStart: string | null;
            dateEnd: string | null;
        };
        aggregates: {
            incsMonthly: {
                month: string;
                total: number;
            }[];
            budgetsMonthly: {
                month: string;
                total: number;
            }[];
            expsMonthly: {
                month: string;
                total: number;
            }[];
            incsTotal: number;
            budgetsTotal: number;
            expsTotal: number;
        };
    }>;
}
