import { User } from 'src/auth/auth.entity';
export declare class Role {
    id: string;
    name: string;
    users: User[];
}
