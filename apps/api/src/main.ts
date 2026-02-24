import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { mkdirSync } from 'fs';
import express from 'express';
import { join } from 'path';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configuredOrigins = (
    process.env.FRONTEND_ORIGIN ?? 'http://localhost:3333'
  )
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);

  app.enableCors({
    origin: configuredOrigins,
    credentials: true,
  });

  app.use(cookieParser());
  app.useGlobalFilters(new GlobalExceptionFilter());

  const uploadRoot = join(process.cwd(), 'uploads');
  mkdirSync(uploadRoot, { recursive: true });
  app.use(
    '/cdn',
    express.static(uploadRoot, {
      maxAge: '30d',
      etag: true,
      index: false,
    }),
  );

  await app.listen(process.env.BACKEND_PORT ?? 5555);
}
bootstrap();
