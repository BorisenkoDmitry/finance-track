import { User } from './auth.entity';
import { AuthService } from './auth.service';
import { AuthCreateDTO } from './dto/auth-create.dto';
import { AuthJoinDTO } from './dto/auth-join.dto';
import { AuthChangePasswordDTO } from './dto/auth-change-pass.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    findAll(): Promise<User[]>;
    findByEmail(email: string): Promise<User | null>;
    findByPhone(phone: string): Promise<User | null>;
    createUser(createUserDTO: AuthCreateDTO): Promise<User>;
    logoutUser(user: User): void;
    changeUserRole({ roleID, userID }: {
        roleID: string;
        userID: string;
    }): Promise<{
        result: boolean;
    }>;
    changePassword(params: AuthChangePasswordDTO, userId: string): Promise<{
        result: boolean;
        user: {
            email: string;
            id: string;
            name: string;
            surname: string;
            roles: import("../roles/roles.entity").Role[];
            imageUrl: string | null;
        };
    }>;
    getMe(userId: string): Promise<{
        result: boolean;
        user: {
            email: string;
            id: string;
            name: string;
            surname: string;
            roles: import("../roles/roles.entity").Role[];
            imageUrl: string | null;
        };
    } | undefined>;
    authJoin(params: AuthJoinDTO): Promise<{
        accessToken: string;
        refreshToken: import("./token/token.entity").Token;
        user: User;
    }>;
    deleteUserWithRelations(id: string): Promise<void>;
}
