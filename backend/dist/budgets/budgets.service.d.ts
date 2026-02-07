import { CatalogEntity } from 'src/catalogs/catalogs.entity';
import { Repository } from 'typeorm';
import { Budgets } from './budgets.entity';
import { CreatedBudgetsDTO } from './dto/create-budgets.dto';
import { GetBudgetsDTO } from './dto/get-budgets.dto';
import { GetBudgetsSumDTO } from './dto/get-budget-sum.dto';
export declare class BudgetService {
    private budgetsRep;
    private catalogRep;
    constructor(budgetsRep: Repository<Budgets>, catalogRep: Repository<CatalogEntity>);
    getAllBudgets(GetBudgetsDTO: GetBudgetsDTO, userId: string): Promise<{
        categoryName: string | undefined;
        id: string;
        color: string;
        comment: string;
        dateCreated: string;
        period: "month";
        planned_amount: string;
        type: import("./dto/get-budgets.dto").CategoryType;
        createdAt: Date;
        user: import("../auth/auth.entity").User;
        userId: string;
        catalogId: string;
    }[]>;
    getBudgetId(id: string, userId: string): Promise<Budgets>;
    createBudget(budget: CreatedBudgetsDTO, userId: string): Promise<Budgets>;
    updateBudget(id: string, budget: CreatedBudgetsDTO, userId: string): Promise<Budgets>;
    deleteBudget(id: string, userId: string): Promise<void>;
    getBudgetsSumRange(userId: string, GetBudgetSumDto: GetBudgetsSumDTO): Promise<{
        financeAnalitic: {
            total: string;
            day: string;
        }[];
        totalPeriodBudgets: string | number;
    }>;
}
