import { Exp } from '../exp.entity';
import { User } from 'src/auth/auth.entity';
export declare class ExpDetail {
    id: string;
    name: string;
    price: string;
    count: string;
    createdAt: Date;
    expId: string;
    exp: Exp;
    user: User;
    userId: string;
}
