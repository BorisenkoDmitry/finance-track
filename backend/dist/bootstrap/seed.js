"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedBootstrap = seedBootstrap;
const bcryptjs_1 = require("bcryptjs");
const typeorm_1 = require("typeorm");
const roles_entity_1 = require("../roles/roles.entity");
const auth_entity_1 = require("../auth/auth.entity");
const catalogs_entity_1 = require("../catalogs/catalogs.entity");
const catalogs_static_1 = require("../catalogs/catalogs.static");
function toBool(v, def = false) {
    if (v === undefined || v === null)
        return def;
    return String(v).toLowerCase() === 'true';
}
async function seedBootstrap(app) {
    const enable = toBool(process.env.SEED_ON_STARTUP, true);
    if (!enable)
        return;
    const ds = app.get(typeorm_1.DataSource);
    const roleRepo = ds.getRepository(roles_entity_1.Role);
    const userRepo = ds.getRepository(auth_entity_1.User);
    const catalogRepo = ds.getRepository(catalogs_entity_1.CatalogEntity);
    const defaultRoles = ['BetaUser', 'SuperAdmin'];
    for (const name of defaultRoles) {
        const exists = await roleRepo.findOne({ where: { name } });
        if (!exists) {
            await roleRepo.save(roleRepo.create({ name }));
        }
    }
    const adminEmail = process.env.SEED_ADMIN_EMAIL;
    const adminPass = process.env.SEED_ADMIN_PASSWORD;
    if (!adminEmail || !adminPass)
        return;
    const existing = await userRepo.findOne({ where: { email: adminEmail }, relations: ['roles'] });
    if (existing)
        return;
    const beta = await roleRepo.findOne({ where: { name: 'BetaUser' } });
    const superAdmin = await roleRepo.findOne({ where: { name: 'SuperAdmin' } });
    const password = (0, bcryptjs_1.hashSync)(adminPass, (0, bcryptjs_1.genSaltSync)(10));
    const user = userRepo.create({
        email: adminEmail,
        phone: process.env.SEED_ADMIN_PHONE ?? '+79990000000',
        name: process.env.SEED_ADMIN_NAME ?? 'Admin',
        surname: process.env.SEED_ADMIN_SURNAME ?? 'Finance',
        password,
        roles: [beta, superAdmin].filter(Boolean),
    });
    const saved = await userRepo.save(user);
    const toCreate = catalogs_static_1.CatalogStatic.map((c) => ({
        ...c,
        userId: saved.id,
    }));
    await catalogRepo.save(toCreate);
}
//# sourceMappingURL=seed.js.map