import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './roles.entity';

export class RoleService {
  constructor(@InjectRepository(Role) private RoleRep: Repository<Role>) {}

  getAll() {
    return this.RoleRep.find();
  }
}
