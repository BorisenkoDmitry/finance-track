import { Role } from 'src/roles/roles.entity';
export declare class AuthCreateDTO {
    readonly email: string;
    readonly phone: string;
    readonly name: string;
    readonly surname: string;
    readonly password: string;
    readonly roles?: Role[];
}
