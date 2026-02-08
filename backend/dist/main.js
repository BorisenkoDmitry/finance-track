"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const path_1 = require("path");
const seed_1 = require("./bootstrap/seed");
function parseCorsOrigins(v) {
    if (typeof v !== 'string' || !v.trim())
        return ['http://localhost:5173'];
    return v
        .split(',')
        .map((x) => x.trim())
        .filter(Boolean);
}
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
        whitelist: true,
    }));
    const config = app.get(config_1.ConfigService);
    const origins = parseCorsOrigins(config.get('CORS_ORIGINS'));
    app.enableCors({
        origin: origins,
        methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
        allowedHeaders: [
            'Origin',
            'X-Requested-With',
            'Content-Type',
            'Accept',
            'Authorization',
        ],
        credentials: true,
        optionsSuccessStatus: 200,
    });
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'public'), {
        prefix: '/public/',
    });
    await (0, seed_1.seedBootstrap)(app);
    const port = Number(config.get('APP_PORT') ?? 3000);
    await app.listen(port);
    console.log(`API listening on ${await app.getUrl()}`);
}
void bootstrap();
//# sourceMappingURL=main.js.map