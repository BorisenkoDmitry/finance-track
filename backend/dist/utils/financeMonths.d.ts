import { Budgets } from 'src/budgets/budgets.entity';
import { Exp } from 'src/exp/exp.entity';
import { IncEntity } from 'src/inc/inc.entity';
export declare function getMonthlyResult(exps: Exp[], inc: IncEntity[], budgets: Budgets[], start?: Date | null, end?: Date | null): {
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
};
