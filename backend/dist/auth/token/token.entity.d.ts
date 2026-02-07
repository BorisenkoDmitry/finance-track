import { User } from '../auth.entity';
export declare class Token {
    id: number;
    token: string;
    exp: Date;
    userId: string;
    user: User;
}
