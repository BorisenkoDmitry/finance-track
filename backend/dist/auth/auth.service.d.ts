import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/roles/roles.entity';
import { Repository } from 'typeorm';
import { User } from './auth.entity';
import { AuthCreateDTO } from './dto/auth-create.dto';
import { AuthJoinDTO } from './dto/auth-join.dto';
import { Token } from './token/token.entity';
import { CatalogsService } from 'src/catalogs/catalogs.service';
import { AuthChangePasswordDTO } from './dto/auth-change-pass.dto';
export declare class AuthService {
    private userRep;
    private readonly roleRepo;
    private readonly tokenRepo;
    private readonly jwtService;
    private CatalogService;
    constructor(userRep: Repository<User>, roleRepo: Repository<Role>, tokenRepo: Repository<Token>, jwtService: JwtService, CatalogService: CatalogsService);
    findAll(): Promise<User[]>;
    private hashPassword;
    findByEmail(email: string, isCreated?: boolean): Promise<User | null>;
    findById(id: string, isCreated?: boolean): Promise<User | null>;
    findByPhone(phone: string, isCreated?: boolean): Promise<User | null>;
    createUser(userCreate: AuthCreateDTO): Promise<User>;
    changePassword(params: AuthChangePasswordDTO, userId: string): Promise<{
        result: boolean;
        user: {
            email: string;
            id: string;
            name: string;
            surname: string;
            roles: Role[];
            imageUrl: string | null;
        };
    }>;
    authJoin(params: AuthJoinDTO): Promise<{
        accessToken: string;
        refreshToken: Token;
        user: User;
    }>;
    getMe(userId: string): Promise<{
        result: boolean;
        user: {
            email: string;
            id: string;
            name: string;
            surname: string;
            roles: Role[];
            imageUrl: string | null;
        };
    } | undefined>;
    private GetRefreshToken;
    logout(user: User): void;
    changeUserRole({ roleID, userID }: {
        roleID: string;
        userID: string;
    }): Promise<{
        result: boolean;
    }>;
    deleteUserWithRelations(id: string): Promise<void>;
}
