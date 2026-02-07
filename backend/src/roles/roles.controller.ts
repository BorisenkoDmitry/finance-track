import { Controller, Get } from '@nestjs/common';
import { RoleService } from './roles.service';

@Controller('roles')
export class RoleController {
  constructor(private readonly RoleService: RoleService) {}

  @Get()
  getAll() {
    return this.RoleService.getAll();
  }
}
