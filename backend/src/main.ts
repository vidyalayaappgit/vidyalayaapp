import 'tsconfig-paths/register';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser'; // ✅ Remove the * as, import default

async function bootstrap() {
  console.log('🚀 Starting bootstrap process...');
  
  try {
    console.log('📦 Creating Nest application...');
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });
    console.log('✅ Nest application created');

    console.log('🔧 Getting ConfigService...');
    const configService = app.get(ConfigService);
    console.log('✅ ConfigService retrieved');

    // Cookie Parser
    console.log('🍪 Setting up cookie parser...');
    app.use(cookieParser()); // ✅ Now callable
    console.log('✅ Cookie parser configured');

    // Validation Pipes
    console.log('🔧 Setting up validation pipes...');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    console.log('✅ Validation pipes configured');

    // CORS
    console.log('🌐 Setting up CORS...');
    const frontendUrl = configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    app.enableCors({
      origin: frontendUrl,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    });
    console.log(`✅ CORS configured for origin: ${frontendUrl}`);

    // Global Prefix
    console.log('📝 Setting global prefix to "api"...');
    app.setGlobalPrefix('api');
    console.log('✅ Global prefix set');

    // Test database connection
    console.log('📊 Testing database connection...');
    try {
      const pool = app.get('DATABASE_POOL');
      const client = await pool.connect();
      console.log('✅ Database connected successfully');
      client.release();
    } catch (dbError: any) { // ✅ Type as any
      console.warn('⚠️  Database connection warning:', dbError?.message);
      console.warn('⚠️  Continuing without database connection...');
    }

    const port = configService.get<number>('PORT') || 3001;
    console.log(`🎯 Attempting to start server on port ${port}...`);

    await app.listen(port);
    console.log(`✅ Server is running on: http://localhost:${port}`);
    console.log(`📚 API endpoint: http://localhost:${port}/api`);
    console.log(`🌐 Frontend URL: ${frontendUrl}`);
  } catch (error: any) { // ✅ Type as any
    console.error('❌ Bootstrap failed with error:');
    console.error(error?.message || error);
    if (error?.stack) {
      console.error('Error stack:', error.stack);
    }
    process.exit(1);
  }
}

bootstrap().catch((err: any) => { // ✅ Type as any
  console.error('❌ Unhandled promise rejection:');
  console.error(err?.message || err);
  process.exit(1);
});