import { RoleService } from './roles.service';
export declare class RoleController {
    private readonly RoleService;
    constructor(RoleService: RoleService);
    getAll(): Promise<import("./roles.entity").Role[]>;
}
