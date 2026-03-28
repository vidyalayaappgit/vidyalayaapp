import 'tsconfig-paths/register';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from '@core/filters/http-exception.filter';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });

  const configService = app.get(ConfigService);

  // ✅ Global Exception Filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // ✅ Cookie Parser
  app.use(cookieParser());

  // ✅ Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ✅ CORS
  app.enableCors({
    origin: 'http://localhost:3000',//origin: configService.get<string>('FRONTEND_URL') ?? 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
   // exposedHeaders: ['Set-Cookie'],
  });

  // ✅ Prefix
  app.setGlobalPrefix('api');

  // 🔥 TYPE SAFE PORT
  const port = configService.get<number>('PORT') ?? 3001;

  await app.listen(port);

  console.log(`🚀 School ERP Backend running on http://localhost:${port}`);
}

bootstrap().catch(err => {
  console.error('Bootstrap failed:', err);
  process.exit(1);
});