import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';

// App
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health.controller';
import { TestController } from './test.controller';
import { TestAuthController } from './test-auth.controller';

// Modules
import { AuthModule } from '@modules/auth/auth.module';
import { NavigationModule } from '@modules/navigation/navigation.module';
import { ControlsModule } from '@modules/controls/controls.module';

// Core
import { DatabaseModule } from '@core/database/database.module';
import { JwtAuthGuard } from '@core/guards/jwt-auth.guard';
import { PermissionGuard } from '@core/guards/permission.guard';

// Config
import { validate } from '@config/env.config';

// Business modules
import { AcademicYearsModule } from '@modules/system_setup/academic_setup/academic_years/academic-years.module';
import { ClassesModule } from '@modules/system_setup/academic_setup/classes/classes.module';
import { SubjectsModule } from '@modules/system_setup/academic_setup/subjects/subjects.module'; // ✅ Fixed path

@Module({
  imports: [
    // Global Config
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      cache: true,
      validate,
    }),

    // Core Modules
    DatabaseModule,

    // JWT Module - make it available globally using ConfigService
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'supersecretkey123',
        signOptions: { expiresIn: '7d' },
      }),
    }),

    // Feature Modules
    AuthModule,
    NavigationModule,
    ControlsModule,

    // Business Modules
    AcademicYearsModule,
    ClassesModule,
    SubjectsModule,
  ],

  controllers: [
    AppController,
    TestController,
    HealthController,
    TestAuthController,
  ],

  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
export class AppModule {}