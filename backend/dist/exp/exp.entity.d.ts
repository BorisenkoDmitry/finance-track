import { ExpDetail } from './expDetail/expdetail.entity';
import { User } from 'src/auth/auth.entity';
import { CatalogEntity } from 'src/catalogs/catalogs.entity';
export declare class Exp {
    id: string;
    price: string;
    descr: string;
    date: Date;
    createdAt: Date;
    products: ExpDetail[];
    user: User;
    userId: string;
    catalogItem?: CatalogEntity;
    catalogId: string;
}
