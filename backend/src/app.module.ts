import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

// App
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Modules (✅ use aliases)
import { AuthModule } from '@modules/auth/auth.module';
import { NavigationModule } from '@modules/navigation/navigation.module';
import { ControlsModule } from '@modules/controls/controls.module';

// Core
import { DatabaseModule } from '@core/database/database.module';
import { JwtAuthGuard } from '@core/guards/jwt-auth.guard';
import { PermissionGuard } from '@core/guards/permission.guard';

// Config
import { validate } from '@config/env.config';

@Module({
  imports: [
    // 🔥 Global Config (validated + cached)
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      cache: true,
      validate,
    }),

    // 🔥 Core Modules
    DatabaseModule,

    // 🔥 Feature Modules
    AuthModule,
    NavigationModule,
    ControlsModule,
  ],

  controllers: [AppController],

  providers: [
    AppService,

    // 🔐 Global Guards (order matters!)
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