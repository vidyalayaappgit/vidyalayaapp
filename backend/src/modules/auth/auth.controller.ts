import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import type { Response } from 'express';

import { ConfigService } from '@nestjs/config';
import ms from 'ms';

import { Public } from '@core/decorators/public.decorator';
import { AuthService } from '@modules/auth/auth.service';
import { LoginDto } from '@modules/auth/dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(
      body.groupCode,
      body.userCode,
      body.password,
    );

    // 🔹 Read environment config safely
    const isProduction =
      this.configService.get<string>('NODE_ENV') === 'production';

    const jwtExpiry =
      this.configService.get<string>('JWT_EXPIRES_IN') ?? '8h';

    // 🔹 Convert expiry → milliseconds (STRICT SAFE)
    const parsed = ms(
      jwtExpiry as unknown as Parameters<typeof ms>[0],
    );

    const maxAge =
      typeof parsed === 'number'
        ? parsed
        : 24 * 60 * 60 * 1000; // fallback

    // 🔐 Set secure cookie
    res.cookie('authToken', result.access_token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge, // ✅ always number
    });

    // 🔹 Remove token from response (security best practice)
    const { access_token, ...responseData } = result;

    return responseData;
  }
}