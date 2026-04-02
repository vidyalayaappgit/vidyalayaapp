import {
  Controller,
  Get,
  Logger,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';

import { JwtGuard } from '@core/guards/jwt.guard';
import { NavigationService } from '@modules/navigation/navigation.service';

interface AuthUser {
  user_id: number;
  role_id: number;
  school_id: number;
  school_group_id: number;
}

@Controller('navigation')
export class NavigationController {
  private readonly logger = new Logger(NavigationController.name);

  constructor(
    private readonly navigationService: NavigationService,
  ) {}

  @UseGuards(JwtGuard)
  @Get()
  async getNavigation(@Req() req: Request) {
    if (!req.user) {
      this.logger.warn('Navigation request arrived without req.user');
      throw new UnauthorizedException();
    }

    const user = req.user as AuthUser;
    const roleId = user.role_id;

    this.logger.log(
      `Fetching navigation for user:${user.user_id} role:${roleId}`,
    );
    this.logger.debug(`Navigation request user payload: ${JSON.stringify(user)}`);
    this.logger.debug(
      `Navigation cookie present: ${Boolean(req.cookies?.['authToken'])}`,
    );

    return this.navigationService.getNavigation(roleId);
  }
}
