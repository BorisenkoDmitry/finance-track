import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { seedBootstrap } from './bootstrap/seed';

function parseCorsOrigins(v: string | undefined): string[] {
  if (!v) return ['http://localhost:5173'];
  return v
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  );

  const config = app.get(ConfigService);
  const origins = parseCorsOrigins(config.get<string>('CORS_ORIGINS'));
  app.enableCors({
    origin: origins,
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    credentials: true,
    optionSuccessStatus: 200,
  });

  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/public/', // URL-префикс
  });

  await seedBootstrap(app);

  const port = Number(config.get('APP_PORT') ?? 3000);
  await app.listen(port);
}
void bootstrap();
