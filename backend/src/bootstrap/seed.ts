import { genSaltSync, hashSync } from 'bcryptjs';
import type { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Role } from 'src/roles/roles.entity';
import { User } from 'src/auth/auth.entity';
import { CatalogEntity } from 'src/catalogs/catalogs.entity';
import { CatalogStatic } from 'src/catalogs/catalogs.static';

function toBool(v: unknown, def = false) {
  if (v === undefined || v === null) return def;
  return String(v).toLowerCase() === 'true';
}

export async function seedBootstrap(app: INestApplication) {
  const enable = toBool(process.env.SEED_ON_STARTUP, true);
  if (!enable) return;

  const ds = app.get(DataSource);
  const roleRepo = ds.getRepository(Role);
  const userRepo = ds.getRepository(User);
  const catalogRepo = ds.getRepository(CatalogEntity);

  // 1) Roles
  const defaultRoles = ['BetaUser', 'SuperAdmin'];
  for (const name of defaultRoles) {
    const exists = await roleRepo.findOne({ where: { name } });
    if (!exists) {
      await roleRepo.save(roleRepo.create({ name }));
    }
  }

  // 2) Admin user from env
  const adminEmail = process.env.SEED_ADMIN_EMAIL;
  const adminPass = process.env.SEED_ADMIN_PASSWORD;
  if (!adminEmail || !adminPass) return;

  const existing = await userRepo.findOne({ where: { email: adminEmail }, relations: ['roles'] });
  if (existing) return;

  const beta = await roleRepo.findOne({ where: { name: 'BetaUser' } });
  const superAdmin = await roleRepo.findOne({ where: { name: 'SuperAdmin' } });

  const password = hashSync(adminPass, genSaltSync(10));
  const user = userRepo.create({
    email: adminEmail,
    phone: process.env.SEED_ADMIN_PHONE ?? '+79990000000',
    name: process.env.SEED_ADMIN_NAME ?? 'Admin',
    surname: process.env.SEED_ADMIN_SURNAME ?? 'Finance',
    password,
    roles: [beta, superAdmin].filter(Boolean) as Role[],
  });

  const saved = await userRepo.save(user);

  // 3) Default catalogs for the admin user
  const toCreate = CatalogStatic.map((c) => ({
    ...c,
    userId: saved.id,
  }));
  await catalogRepo.save(toCreate);
}

