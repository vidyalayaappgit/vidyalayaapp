import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { NavigationModule } from './navigation/navigation.module';
import { ControlsModule } from './controls/controls.module';
// 🔐 Guards
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { PermissionGuard } from './common/guards/permission.guard';
import { DatabaseModule } from './database/database.module';
import { TestModule } from './test/test.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 🔥 env available everywhere
    }),
    DatabaseModule,
    AuthModule,
    NavigationModule,
    ControlsModule,
    TestModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,

    // ✅ 1. JWT Guard (FIRST)
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },

    // ✅ 2. Permission Guard (SECOND)
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
export class AppModule {}
