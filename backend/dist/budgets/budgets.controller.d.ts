import { Budgets } from './budgets.entity';
import { BudgetService } from './budgets.service';
import { GetBudgetsDTO } from './dto/get-budgets.dto';
import { CreatedBudgetsDTO } from './dto/create-budgets.dto';
export declare class BudgetsController {
    private readonly budgetService;
    constructor(budgetService: BudgetService);
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
}
