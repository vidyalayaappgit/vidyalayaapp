import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { StringValue } from 'ms';

// Controllers & Services
import { AuthController } from '@modules/auth/auth.controller';
import { AuthService } from '@modules/auth/auth.service';
import { JwtStrategy } from '@modules/auth/strategies/jwt.strategy';

// Core
import { DatabaseModule } from '@core/database/database.module';

@Module({
  imports: [
    DatabaseModule,

    // 🔐 JWT Configuration (STRICT + TYPE SAFE)
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.getOrThrow<string>('JWT_SECRET');

        const expiresIn =
          configService.get<StringValue>('JWT_EXPIRES_IN') ?? '8h';

        return {
          secret,
          signOptions: {
            expiresIn,
          },
        };
      },
    }),
  ],

  controllers: [AuthController],

  providers: [
    AuthService,
    JwtStrategy,
  ],

  exports: [AuthService], // 🔥 important for reuse
})
export class AuthModule {}