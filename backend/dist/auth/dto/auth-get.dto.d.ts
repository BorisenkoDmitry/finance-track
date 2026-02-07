import { Role } from 'src/roles/roles.entity';
export declare class GetUserDTO {
    id: string;
    email: string;
    phone: string;
    name: string;
    surname: string;
    password: string;
    roles: Role[];
}
