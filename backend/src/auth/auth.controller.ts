import { 
  Controller, 
  Post, 
  Body, 
  Res, 
  HttpStatus,
  HttpCode 
} from '@nestjs/common';
import type { Response } from 'express';
import { Public } from 'src/common/decorators/public.decorator';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() body: { groupCode: string; userCode: string; password: string }, 
    @Res({ passthrough: true }) res: Response
  ) {
    const result = await this.authService.login(
      body.groupCode,
      body.userCode,
      body.password
    );
    
    // ✅ FIXED: Use access_token (your service response)
    res.cookie('authToken', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,  // 24h
    });

    // ✅ Return everything except token (for security)
    const { access_token, ...responseData } = result;
    return responseData;
  }
}
