import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🔥 REQUIRED FOR COOKIE-BASED AUTH
  app.use(cookieParser()); // 👈 ADD THIS LINE

  app.enableCors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Set-Cookie'],
  });

  app.setGlobalPrefix('api');

  const port = process.env.PORT ?? 3001;
  await app.listen(port);

  console.log(`🚀 School ERP Backend running on http://localhost:${port}`);
}

bootstrap().catch(err => {
  console.error('Bootstrap failed:', err);
  process.exit(1);
});