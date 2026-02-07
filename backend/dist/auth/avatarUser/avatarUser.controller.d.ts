import { AvatarService } from './avatarUser.service';
export declare class AvatarController {
    private avatarService;
    constructor(avatarService: AvatarService);
    upload(file: Express.Multer.File, userId: string): Promise<{
        user: {
            email: string;
            id: string;
            name: string;
            surname: string;
            roles: import("../../roles/roles.entity").Role[];
            imageUrl: string;
        };
    } | undefined>;
    delete(userId: string): Promise<{
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
