import { Repository } from 'typeorm';
import { User } from '../auth.entity';
export declare class AvatarService {
    private userRep;
    constructor(userRep: Repository<User>);
    private readonly AVATAR_DIR;
    uploadAvatar(userId: string, file: Express.Multer.File): Promise<{
        user: {
            email: string;
            id: string;
            name: string;
            surname: string;
            roles: import("../../roles/roles.entity").Role[];
            imageUrl: string;
        };
    } | undefined>;
    deleteAvatar(userId: string): Promise<{
        user: {
            email: string;
            id: string;
            name: string;
            surname: string;
            roles: import("../../roles/roles.entity").Role[];
            imageUrl: null;
        };
    } | undefined>;
}
