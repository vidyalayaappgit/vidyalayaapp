import { Controller, Post, Res, Logger } from '@nestjs/common';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Public } from '@core/decorators/public.decorator';

@Controller('test-auth')
@Public()
export class TestAuthController {
  private readonly logger = new Logger(TestAuthController.name);

  constructor(private jwtService: JwtService) {}

  @Post('login')
  async testLogin(@Res() res: Response) {
    try {
      // Test user payload - matches your JWT strategy expectations
      const payload = {
        user_id: 1,
        role_id: 1,
        school_id: 1,
        school_group_id: 1,
        email: 'admin@school.com',
      };

      const token = this.jwtService.sign(payload);

      this.logger.log(`Test login successful for user_id: ${payload.user_id}`);

      // Set cookie
      res.cookie('authToken', token, {
        httpOnly: true,
        secure: false, // Set to true in production with HTTPS
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return res.json({
        success: true,
        message: 'Test login successful',
        user: payload,
        token, // Also return token for Bearer auth if needed
      });
    } catch (error: any) { // ✅ Add type annotation 'any'
      this.logger.error('Test login failed:', error);
      return res.status(500).json({
        success: false,
        message: 'Test login failed',
        error: error?.message || 'Unknown error',
      });
    }
  }
}