import { User } from 'src/auth/auth.entity';
import { Budgets } from 'src/budgets/budgets.entity';
import { Exp } from 'src/exp/exp.entity';
export declare enum TypeCatalog {
    inc = 1,
    exp = 2,
    source = 3,
    pay = 4
}
export declare class CatalogEntity {
    id: string;
    catalogName: string;
    catalogColor: string;
    catalogType: TypeCatalog;
    createdAt: Date;
    user: User;
    userId: string;
    exps: Exp[];
    budgets: Budgets[];
}
