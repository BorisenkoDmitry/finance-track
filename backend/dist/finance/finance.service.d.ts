import { Budgets } from 'src/budgets/budgets.entity';
import { BudgetService } from 'src/budgets/budgets.service';
import { CatalogEntity } from 'src/catalogs/catalogs.entity';
import { Exp } from 'src/exp/exp.entity';
import { ExpService } from 'src/exp/exp.service';
import { IncEntity } from 'src/inc/inc.entity';
import { IncService } from 'src/inc/inc.service';
import { Repository } from 'typeorm';
import { GetFinanceDTO } from './dto/get-finance.dto';
export declare class FinanceService {
    private ExpRep;
    private IncRep;
    private CatalogRep;
    private BudgetsRep;
    private ExpService;
    private IncService;
    private BudgetsService;
    constructor(ExpRep: Repository<Exp>, IncRep: Repository<IncEntity>, CatalogRep: Repository<CatalogEntity>, BudgetsRep: Repository<Budgets>, ExpService: ExpService, IncService: IncService, BudgetsService: BudgetService);
    getExpInc(userId: string): Promise<{
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
        catalogType: import("src/catalogs/catalogs.entity").TypeCatalog;
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
