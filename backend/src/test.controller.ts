import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '@core/guards/jwt-auth.guard';
import { Public } from '@core/decorators/public.decorator';

@Controller('test')
export class TestController {
  @Get()
  @Public() // This endpoint is public, no auth required
  test() {
    return {
      status: 'ok',
      message: 'Server is running!',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('auth')
  @UseGuards(JwtAuthGuard) // This endpoint requires authentication
  testAuth(@Req() req: Request) {
    const user = (req as any).user;
    return {
      status: 'ok',
      message: 'Authenticated endpoint working!',
      user: {
        user_id: user.user_id,
        role_id: user.role_id,
        school_id: user.school_id,
      },
      timestamp: new Date().toISOString(),
    };
  }
}