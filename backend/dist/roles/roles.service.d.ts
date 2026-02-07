import { Repository } from 'typeorm';
import { Role } from './roles.entity';
export declare class RoleService {
    private RoleRep;
    constructor(RoleRep: Repository<Role>);
    getAll(): Promise<Role[]>;
}
