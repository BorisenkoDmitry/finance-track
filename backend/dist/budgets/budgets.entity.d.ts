import { CategoryType } from './dto/get-budgets.dto';
import { User } from 'src/auth/auth.entity';
import { CatalogEntity } from 'src/catalogs/catalogs.entity';
export declare class Budgets {
    id: string;
    categoryName: string;
    color: string;
    comment: string;
    dateCreated: string;
    period: 'month';
    planned_amount: string;
    type: CategoryType;
    createdAt: Date;
    user: User;
    userId: string;
    catalogItem?: CatalogEntity;
    catalogId: string;
}
